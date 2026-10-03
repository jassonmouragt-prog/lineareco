/**
 * Gera src/data/gallery.generated.ts a partir das pastas em
 * public/images/portfolio/.
 *
 * Para quem edita pelo celular, a regra e uma coisa so: uma pasta = um projeto,
 * e as fotos dentro da pasta sao as fotos daquele projeto. Nada mais.
 *
 *   public/images/portfolio/projeto-01/
 *     01.webp          <- a capa do projeto (primeiro arquivo da lista)
 *     02.webp
 *     projeto.txt      <- opcional: "nome: ..." e "tipo: ..."
 *     fotos.txt        <- opcional: a ordem das fotos, uma por linha
 *
 * Os dois arquivos .txt existem porque sao faceis de editar no GitHub pelo
 * celular: nao tem chave, virgula, aspa ou colchete — nao existe sintaxe que
 * possa quebrar o site. Se algo estiver errado, o script avisa e usa o padrao,
 * em vez de impedir a publicacao.
 *
 * O script nao usa nenhuma dependencia externa: as dimensoes das imagens sao
 * lidas direto do cabecalho do arquivo, para nao precisar de modulos nativos
 * (que quebram em maquinas e CI diferentes).
 *
 * Rode com:  npm run portfolio
 */

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = join(ROOT, "public", "images", "portfolio");
const OUTPUT_FILE = join(ROOT, "src", "data", "gallery.generated.ts");

const SUPPORTED = [".webp", ".jpg", ".jpeg", ".png"];
const IGNORED_NAMES = [".ds_store", "thumbs.db", "desktop.ini", ".gitkeep"];
const IGNORED_EXTENSIONS = [".txt"];
const DEFAULT_CATEGORY = "Celebração";

const problems = [];
const warnings = [];

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
/* Leitura dos arquivos de texto                                       */
/* ------------------------------------------------------------------ */

function readText(file) {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

/** "nome: Casamento" -> { nome: "Casamento" }. Sem chaves, sem aspas. */
function parseKeyValue(text) {
  const pairs = {};

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;

    pairs[trimmed.slice(0, separator).trim().toLowerCase()] = trimmed
      .slice(separator + 1)
      .trim();
  }

  return pairs;
}

/**
 * "01.webp | descrição da foto | 50% 30%" -> arquivo, alt e enquadramento.
 * As partes depois do primeiro "|" sao opcionais.
 */
function parsePhotoList(text) {
  const entries = [];

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;

    const parts = trimmed.split("|").map((part) => part.trim());

    entries.push({
      file: parts[0],
      alt: parts[1] ?? "",
      position: parts[2] ?? "",
    });
  }

  return entries;
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

function listPhotos(folder) {
  const names = readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("."))
    .filter((name) => !IGNORED_NAMES.includes(name.toLowerCase()))
    .filter((name) => !IGNORED_EXTENSIONS.includes(extname(name).toLowerCase()));

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

function orderPhotos(folder, onDisk) {
  const listText = readText(join(folder, "fotos.txt"));

  // Sem fotos.txt, a ordem alfabetica dos arquivos ja e a esperada.
  if (listText === null) {
    return onDisk.map((file) => ({ file, alt: "", position: "" }));
  }

  const byLowerName = new Map(onDisk.map((file) => [file.toLowerCase(), file]));
  const ordered = [];
  const used = new Set();

  for (const entry of parsePhotoList(listText)) {
    const actual = byLowerName.get(entry.file.toLowerCase());

    if (actual === undefined) {
      warnings.push(
        `${basename(folder)}/fotos.txt cita "${entry.file}", que não está na pasta. ` +
          `Confira o nome — se a foto for nova, acrescente uma linha para ela.`,
      );
      continue;
    }
    if (used.has(actual)) {
      warnings.push(`${basename(folder)}/fotos.txt repete "${actual}". Mostrada uma vez só.`);
      continue;
    }

    used.add(actual);
    ordered.push({ file: actual, alt: entry.alt, position: entry.position });
  }

  for (const file of onDisk) {
    if (!used.has(file)) {
      warnings.push(
        `${basename(folder)}/${file} não está em fotos.txt. Colocada no fim do projeto.`,
      );
      ordered.push({ file, alt: "", position: "" });
    }
  }

  return ordered;
}

const ALT_TEMPLATES = [
  (title) => `Ambientação de ${title} realizada pela Linear & Co.`,
  (title) => `Mesa de ${title} decorada pela Linear & Co.`,
  (title) => `Detalhe de decoração em ${title} pela Linear & Co.`,
  (title) => `Arranjos e ornamentos de ${title} pela Linear & Co.`,
];

function buildProjects() {
  mkdirSync(SOURCE_DIR, { recursive: true });

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
    const details = parseKeyValue(readText(join(folder, "projeto.txt")) ?? "");
    const onDisk = listPhotos(folder);
    const ordered = orderPhotos(folder, onDisk);

    if (onDisk.length === 0) {
      problems.push(
        `${folderName} não tem nenhuma foto. Coloque ao menos uma imagem ou apague a pasta.`,
      );
    }

    const title = details.nome !== undefined && details.nome !== ""
      ? details.nome
      : toTitle(folderName);
    const category = details.tipo !== undefined && details.tipo !== ""
      ? details.tipo
      : DEFAULT_CATEGORY;

    return {
      id: folderName,
      label: `PROJETO ${String(index + 1).padStart(2, "0")}`,
      title,
      category,
      photos: ordered.map((entry, photoIndex) => {
        const size = readImageSize(join(folder, entry.file));

        if (!size || !size.width || !size.height) {
          problems.push(
            `Não consegui ler as dimensões de ${folderName}/${entry.file}. ` +
              `Se for HEIC ou AVIF, converta para .webp antes de subir.`,
          );
        }

        const fallback = ALT_TEMPLATES[photoIndex % ALT_TEMPLATES.length](title);

        return {
          src: `/images/portfolio/${folderName}/${entry.file}`,
          alt: entry.alt !== "" ? entry.alt : fallback,
          width: size?.width ?? 0,
          height: size?.height ?? 0,
          ...(entry.position !== "" ? { position: entry.position } : {}),
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
// Fonte: public/images/portfolio/<projeto>/
// Gere com: npm run portfolio   (ou só commitando as fotos, o CI refaz)
//
// Uma pasta = um projeto. A ordem das fotos é a de fotos.txt, e na falta dela
// a ordem alfabética dos arquivos (01.webp é a capa, 02.webp a segunda, etc).
// O nome e o tipo do projeto vêm de projeto.txt. Todos os arquivos de texto são
// opcionais: sem eles o site usa o nome da pasta e descrições automáticas.

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
  const projects = buildProjects();

  for (const warning of warnings) console.warn(`  ! ${warning}`);

  if (problems.length > 0) {
    console.error("\n✗ Não consegui gerar o portfólio:\n");
    for (const problem of problems) console.error(`  · ${problem}`);
    console.error("");
    process.exit(1);
  }

  const source = renderSource(projects);
  const current = readText(OUTPUT_FILE);

  if (current === source) {
    console.log("✓ Portfólio já estava atualizado — nada a fazer.");
  } else {
    writeFileSync(OUTPUT_FILE, source);
    console.log("✓ src/data/gallery.generated.ts atualizado.");
  }

  const totalPhotos = projects.reduce((sum, project) => sum + project.photos.length, 0);
  console.log(`✓ ${projects.length} projeto(s), ${totalPhotos} foto(s).`);
  for (const project of projects) {
    console.log(`  ${project.id} — ${project.title} (${project.photos.length} foto[s])`);
  }
}

main();
