/**
 * Leitura e escrita dos arquivos de texto de cada projeto.
 *
 * Formato (o mesmo que o scripts/build-portfolio.mjs consome):
 *   projeto.txt -> "nome: ..." e "tipo: ..."
 *   fotos.txt   -> uma foto por linha, "01.webp | descricao", que define a
 *                  ordem e portanto a capa (primeira linha)
 *
 * Tudo aqui e texto simples de proposito: e o que da para editar no celular
 * sem risco de syntaxe quebrada.
 */

export const INFO_FILE = "projeto.txt";
export const ORDER_FILE = "fotos.txt";
export const FOLDER_PREFIX = "public/images/portfolio";

export const PHOTO_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"] as const;

export interface PhotoEntry {
  file: string;
  alt: string;
}

export interface ProjectDetails {
  nome: string;
  tipo: string;
}

const MAX_TEXT_LENGTH = 120;
const MAX_ALT_LENGTH = 200;

/* ------------------------------------------------------------------ */
/* Leitura                                                             */
/* ------------------------------------------------------------------ */

export function parseInfo(text: string | null): ProjectDetails {
  const pairs: Record<string, string> = {};

  for (const line of (text ?? "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;

    pairs[trimmed.slice(0, separator).trim().toLowerCase()] = trimmed.slice(separator + 1).trim();
  }

  return { nome: pairs.nome ?? "", tipo: pairs.tipo ?? "" };
}

export function parsePhotoList(text: string | null): PhotoEntry[] {
  const entries: PhotoEntry[] = [];

  for (const line of (text ?? "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;

    const parts = trimmed.split("|").map((part) => part.trim());
    entries.push({ file: parts[0], alt: parts[1] ?? "" });
  }

  return entries;
}

/* ------------------------------------------------------------------ */
/* Escrita                                                             */
/* ------------------------------------------------------------------ */

export function serializeInfo({ nome, tipo }: ProjectDetails): string {
  return `nome: ${nome}\ntipo: ${tipo}\n`;
}

export function serializePhotoList(entries: PhotoEntry[]): string {
  return entries.map((entry) => `${entry.file} | ${entry.alt}`).join("\n") + "\n";
}

/* ------------------------------------------------------------------ */
/* Validacao (entrada vem do celular, entao precisa ser rigido)         */
/* ------------------------------------------------------------------ */

export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";

  return (
    value
      // remove quebras de linha e caracteres de controle: o valor vem de um
      // campo de formulario e precisa caber em uma linha de arquivo .txt
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength)
  );
}

/**
 * Nome de pasta de projeto: minusculas, digitos e hifen. Proibido caminho,
 * proibido "." e "..", para nunca escrever fora de public/images/portfolio.
 */
export function isValidProjectId(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 60;
}

/**
 * Nome de foto: dois digitos, ponto e extensao da lista. O prefixo numerico e
 * o que define a ordem, entao o cliente nao precisa renomear nada para
 * reordenar: basta a ordem das linhas do fotos.txt.
 */
export function isValidPhotoFile(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{2}\.(?:webp|jpg|jpeg|png)$/.test(value)
  );
}

export function extensionOf(file: string): string {
  const dot = file.lastIndexOf(".");
  return dot === -1 ? "" : file.slice(dot).toLowerCase();
}

/** Proximo numero livre com dois digitos (01, 02, ... 99). */
export function nextPhotoName(taken: string[]): string | null {
  const used = new Set(taken);

  for (let index = 1; index <= 99; index += 1) {
    const candidate = String(index).padStart(2, "0");
    if (![...used].some((file) => file.startsWith(`${candidate}.`))) {
      return candidate;
    }
  }

  return null;
}

/** Ordena o que veio do disco e junta com a ordem do fotos.txt. */
export function mergeOrder(filesOnDisk: string[], entries: PhotoEntry[]): PhotoEntry[] {
  const ordered: PhotoEntry[] = [];
  const used = new Set<string>();

  for (const entry of entries) {
    if (!filesOnDisk.includes(entry.file) || used.has(entry.file)) continue;
    used.add(entry.file);
    ordered.push(entry);
  }

  for (const file of [...filesOnDisk].sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))) {
    if (used.has(file)) continue;
    used.add(file);
    ordered.push({ file, alt: "" });
  }

  return ordered;
}

export { MAX_TEXT_LENGTH, MAX_ALT_LENGTH };
