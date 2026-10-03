#!/usr/bin/env node
/**
 * Gera o valor de ADMIN_PASSWORD_HASH.
 *
 *   npm run admin:senha -- "minha senha"
 *
 * O formato tem de bater exatamente com o que src/lib/admin/auth.ts verifica:
 * scrypt:<salt em base64>:<hash em base64>, com 16 bytes de sal e chave de 64.
 */

import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const password = process.argv[2];

if (!password) {
  console.error('Uso: npm run admin:senha -- "sua senha"');
  process.exit(1);
}

if (password.length < 8) {
  console.error("Use pelo menos 8 caracteres.");
  process.exit(1);
}

const salt = randomBytes(16);
const derived = await scrypt(password, salt, 64);

console.log("Cole isto em ADMIN_PASSWORD_HASH (na Vercel e/ou .env.local):");
console.log("");
console.log(`scrypt:${salt.toString("base64")}:${derived.toString("base64")}`);
console.log("");
console.log("A senha em texto puro nao foi gravada em lugar nenhum.");
