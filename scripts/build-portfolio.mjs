/**
 * Gera src/data/gallery.generated.ts a partir das pastas em
 * public/images/portfolio/.
 *
 * Para o cliente leigo, a regra e uma coisa so: uma pasta = um projeto,
 * e as fotos dentro da pasta sao as fotos daquele projeto. Nada mais.
 *
 *   public/images/portfolio/projeto-01/
 *     01.webp          <- a primeira foto (capa do projeto)
 *     02.webp
 *     projeto.json     <- opcional: titulo, categoria e textos das fotos
 *
 * O script nao usa nenhuma dependencia externa: as dimensoes das imagens
 * sao lidas direto do cabecalho do arquivo, para nao precisar de modulos
 * nativos (que quebram em maquinas e CI diferentes).
 *
 * Rode com:  npm run portfolio
 */

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = join(ROOT, "public", "images", "portfolio");
const OUTPUT_FILE = join(ROOT, "src", "data", "gallery.generated.ts");

const SUPPORTED = [".webp", ".jpg", ".jpeg", ".png"];
const IGNORED = [".ds_store", "thumbs.db", "desktop.ini", ".gitkeep"];
const problems = [];

/* ------------------------------------------------------------------ */
/* Leitura de dimensoes sem dependencia                                */
/* ------------------------------------------------------------------ */

function readWebpSize(buffer) {
  if (buffer.length < 30) return null;
  const chunkAt = (offset) => buffer.toString("ascii", offset, offset + 4);
  let offset = 12;

  while (offset + 8 <= buffer.length) {
    const type = chunkAt(offset);
    const size = buffer.readUInt32LE(offset + 4);
    const body = offset + 8;

    if (type === "VP8X" && body + 10 <= buffer.length) {
      return {
        width: 1 + (buffer[body + 4] | (buffer[body + 5] << 8) | (buffer[body + 6] << 16)),
        height: 1 + (buffer[body + 7] | (buffer[body + 8] << 8) | (buffer[body + 9] << 16)),
      };
    }

    if (type === "VP8L" && body + 5 <= buffer.length) {
      const bits = buffer.readUInt32LE(body + 1);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }

    if (type === "VP8 " && body + 10 <= buffer.length) {
      return {
        width: buffer.readUInt16LE(body + 6) & 0x3fff,
        height: buffer.readUInt16LE(body + 8) & 0x3fff,
      };
    }

    if (size <= 0) break;
    offset = body + size + (size % 2);
  }

  return null;
}

const SOF_MARKERS = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function readJpegSize(buffer) {
  let offset = 2;

  while (offset + 4 <= buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];

    // Marcadores sem payload: fill byte e marcadores de reinicio.
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      offset += 2;
      continue;
    }

    const length = buffer.readUInt16BE(offset + 2);

    if (SOF_MARKERS.has(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + length;
  }

  return null;
}

function readPngSize(buffer) {
  if (buffer.length < 24) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function readImageSize(file) {
  const buffer = readFileSync(file);
  const extension = extname(file).toLowerCase();

  if (extension === ".webp") return readWebpSize(buffer);
  if (extension === ".png") return readPngSize(buffer);
  return readJpegSize(buffer);
}

/* ------------------------------------------------------------------ */
/* Pastas = projetos                                                   */
/* ------------------------------------------------------------------ */

function toTitle(slug) {
  const words = slug
    .replace(/\d+/g, "")
    .split(/[-_\s]+/)
    .filter(Boolean);

  if (words.length === 0) return slug;

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function readProjectConfig(folder) {
  const configFile = join(folder, "projeto.json");

  if (!existsSafe(configFile)) return {};

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(configFile, "utf8"));
  } catch (error) {
    problems.push(
      `${basename(folder)}/projeto.json tem JSON inválido (${error.message}). ` +
        `Confira se há vírgula sobrando no final.`,
    );
    return {};
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    problems.push(`${basename(folder)}/projeto.json deve conter um objeto entre { }.`);
    return {};
  }

  return parsed;
}

function existsSafe(file) {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}

function listPhotos(folder) {
  const names = readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.toLowerCase() !== "projeto.json")
    .filter((name) => !name.startsWith("."))
    .filter((name) => !IGNORED.includes(name.toLowerCase()));

  // Qualquer arquivo que nao seja imagem suportada vira erro em vez de ser
  // descartado em silencio: uma foto que some do site sem aviso e pior do que
  // um build que falha com a explicacao.
  for (const name of names) {
    const extension = extname(name).toLowerCase();
    if (!SUPPORTED.includes(extension)) {
      const hint = extension === ".heic" || extension === ".heif"
        ? "No iPhone: Compartilhar > Salvar imagem, que salva como .jpg."
        : "Converta a imagem para .jpg ou .webp antes de subir.";
      problems.push(
        `${basename(folder)}/${name} não é uma imagem suportada. ${hint}`,
      );
    }
  }

  return names
    .filter((name) => SUPPORTED.includes(extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
}

function buildProjects() {
  const folders = readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

  if (folders.length === 0) {
    problems.push(
      `Nenhuma pasta de projeto encontrada em public/images/portfolio/. ` +
        `Crie uma pasta (ex.: projeto-08) com as fotos dentro.`,
    );
    return [];
  }

  return folders.map((folderName, index) => {
    const folder = join(SOURCE_DIR, folderName);
    const config = readProjectConfig(folder);
    const photos = listPhotos(folder);
    const title =
      typeof config.title === "string" && config.title.trim() !== ""
        ? config.title.trim()
        : toTitle(folderName);
    const category =
      typeof config.category === "string" && config.category.trim() !== ""
        ? config.category.trim()
        : "Celebração";
    const alts = config.alts && typeof config.alts === "object" ? config.alts : {};
    const positions = config.positions && typeof config.positions === "object" ? config.positions : {};

    if (photos.length === 0) {
      problems.push(
        `${folderName} não tem nenhuma foto. Coloque ao menos uma imagem ou apague a pasta.`,
      );
    }

    const label = `PROJETO ${String(index + 1).padStart(2, "0")}`;

    return {
      id: folderName,
      label,
      title,
      category,
      photos: photos.map((file) => {
        const size = readImageSize(join(folder, file));

        if (!size || !size.width || !size.height) {
          problems.push(
            `Não consegui ler as dimensões de ${folderName}/${file}. ` +
              `Se for HEIC ou AVIF, converta para .webp antes de subir.`,
          );
        }

        const fallbackAlt = `${title} — foto ${file.replace(/\.\w+$/, "")} pela Linear & Co.`;
        const position = positions[file];

        return {
          src: `/images/portfolio/${folderName}/${file}`,
          alt: typeof alts[file] === "string" && alts[file].trim() !== ""
            ? alts[file].trim()
            : fallbackAlt,
          width: size?.width ?? 0,
          height: size?.height ?? 0,
          ...(typeof position === "string" && position.trim() !== ""
            ? { position: position.trim() }
            : {}),
        };
      }),
    };
  });
}

/* ------------------------------------------------------------------ */
/* Saida                                                               */
/* ------------------------------------------------------------------ */

function renderSource(projects) {
  const body = projects
    .map((project) => {
      const photos = project.photos
        .map((photo) => {
          const lines = [
            `      src: ${JSON.stringify(photo.src)},`,
            `      alt: ${JSON.stringify(photo.alt)},`,
            `      width: ${photo.width},`,
            `      height: ${photo.height},`,
          ];
          if (photo.position) lines.push(`      position: ${JSON.stringify(photo.position)},`);
          return `    {\n${lines.join("\n")}\n    },`;
        })
        .join("\n");

      return `  {
    id: ${JSON.stringify(project.id)},
    label: ${JSON.stringify(project.label)},
    title: ${JSON.stringify(project.title)},
    category: ${JSON.stringify(project.category)},
    photos: [
${photos}
    ],
  },`;
    })
    .join("\n");

  return `// ESTE ARQUIVO É GERADO AUTOMATICAMENTE. NÃO EDITE NA MÃO.
//
// Fonte: public/images/portfolio/<projeto>/<foto>
// Gere com: npm run portfolio   (ou só commitando as fotos, o CI refaz)
//
// Uma pasta = um projeto. A ordem das fotos é a ordem alfabética dos
// arquivos, então 01.webp é a capa, 02.webp a segunda foto, e assim por diante.

export interface PortfolioPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
}

export interface PortfolioProject {
  id: string;
  label: string;
  title: string;
  category: string;
  photos: PortfolioPhoto[];
}

export const portfolioProjects: PortfolioProject[] = [
${body}
];
`;
}

function main() {
  mkdirSync(SOURCE_DIR, { recursive: true });
  const projects = buildProjects();

  if (problems.length > 0) {
    console.error("\n✗ Não consegui gerar o portfólio:\n");
    for (const problem of problems) console.error(`  · ${problem}`);
    console.error("");
    process.exit(1);
  }

  const source = renderSource(projects);
  const current = existsSafe(OUTPUT_FILE) ? readFileSync(OUTPUT_FILE, "utf8") : "";

  if (current === source) {
    console.log("✓ Portfólio já estava atualizado — nada a fazer.");
  } else {
    writeFileSync(OUTPUT_FILE, source);
    console.log(`✓ src/data/gallery.generated.ts atualizado.`);
  }

  const totalPhotos = projects.reduce((sum, project) => sum + project.photos.length, 0);
  console.log(`✓ ${projects.length} projeto(s), ${totalPhotos} foto(s).`);
  for (const project of projects) {
    console.log(`  ${project.id} — ${project.title} (${project.photos.length} foto[s])`);
  }
}

main();
