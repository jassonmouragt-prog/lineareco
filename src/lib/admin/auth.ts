/**
 * Autenticacao do painel /admin.
 *
 * Decisoes:
 * - a senha nunca e guardada, so o hash scrypt (crypto nativo, sem dependencia)
 * - a sessao e um token assinado com HMAC (stateless: nao precisa de banco nem
 *   de storage do Vercel para valer a sessao)
 * - comparacoes com timingSafeEqual, para nao vazar informacao por tempo
 * - limite de tentativas por IP, para segurar forca bruta
 *
 * NENHUM segredo pode ficar no codigo: o repositorio e publico.
 */

import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const COOKIE_NAME = "linear_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 6;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

export const sessionCookieName = COOKIE_NAME;
export const sessionCookieMaxAge = SESSION_TTL_MS / 1000;

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET ausente ou curto demais (minimo 32 caracteres).",
    );
  }
  return value;
}

/* ------------------------------------------------------------------ */
/* Senha                                                               */
/* ------------------------------------------------------------------ */

/** Gera o valor para colar em ADMIN_PASSWORD_HASH. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  return `scrypt:${salt.toString("base64")}:${derived.toString("base64")}`;
}

async function verifyPassword(password: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) return false;

  const [scheme, saltPart, hashPart] = stored.split(":");
  if (scheme !== "scrypt" || !saltPart || !hashPart) return false;

  const expected = Buffer.from(hashPart, "base64");
  const derived = await scrypt(password, Buffer.from(saltPart, "base64"), expected.length);

  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

/* ------------------------------------------------------------------ */
/* Sessao                                                              */
/* ------------------------------------------------------------------ */

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Token no formato "<expiraEmMs>.<assinatura>". */
export function createSessionToken(now = Date.now()): string {
  const payload = String(now + SESSION_TTL_MS);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  if (!token) return false;

  const separator = token.lastIndexOf(".");
  if (separator === -1) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = sign(payload);

  const given = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > now;
}

/* ------------------------------------------------------------------ */
/* Limite de tentativas                                                */
/* ------------------------------------------------------------------ */

const attempts = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(ip: string, now = Date.now()): boolean {
  const record = attempts.get(ip);
  if (!record) return false;

  if (record.resetAt <= now) {
    attempts.delete(ip);
    return false;
  }

  return record.count >= MAX_ATTEMPTS;
}

export function registerFailedAttempt(ip: string, now = Date.now()): void {
  const record = attempts.get(ip);

  if (!record || record.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return;
  }

  record.count += 1;
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip);
}

/** Resumo do estado, so para a tela de login mostrar quanto falta. */
export function attemptsLeft(ip: string, now = Date.now()): number {
  const record = attempts.get(ip);
  if (!record || record.resetAt <= now) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - record.count);
}

/**
 * Login completo. Devolve o token de sessao ou null.
 * Comparacao em tempo constante mesmo quando nao ha hash configurado.
 */
export async function attemptLogin(
  password: string,
  ip: string,
  now = Date.now(),
): Promise<string | null> {
  if (isRateLimited(ip, now)) return null;

  if (!(await verifyPassword(password))) {
    registerFailedAttempt(ip, now);
    return null;
  }

  clearAttempts(ip);
  return createSessionToken(now);
}
