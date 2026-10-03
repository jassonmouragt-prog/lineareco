import { NextResponse } from "next/server";

import type { AdminPhoto, AdminProject } from "@/lib/admin/types";
import { getFile, listDirectory, listFolders, putFile } from "@/lib/admin/github";
import {
  FOLDER_PREFIX,
  INFO_FILE,
  MAX_TEXT_LENGTH,
  ORDER_FILE,
  cleanText,
  isValidProjectId,
  mergeOrder,
  parseInfo,
  parsePhotoList,
  publicUrl,
  serializeInfo,
  serializePhotoList,
} from "@/lib/admin/portfolio";

export async function readPortfolio(): Promise<AdminProject[]> {
  const folders = (await listFolders(FOLDER_PREFIX))
    .filter((name) => isValidProjectId(name))
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

  const projects: AdminProject[] = [];

  for (const id of folders) {
    const base = `${FOLDER_PREFIX}/${id}`;
    const [infoFile, orderFile, filesOnDisk] = await Promise.all([
      getFile(`${base}/${INFO_FILE}`),
      getFile(`${base}/${ORDER_FILE}`),
      listDirectory(base),
    ]);

    const details = parseInfo(infoFile?.text ?? null);
    const photos = filesOnDisk.filter((file) => /\.(?:webp|jpg|jpeg|png)$/i.test(file));
    const entries = mergeOrder(photos, parsePhotoList(orderFile?.text ?? null));

    const listed: AdminPhoto[] = await Promise.all(
      entries.map(async (entry) => {
        const file = await getFile(`${base}/${entry.file}`);
        return {
          file: entry.file,
          alt: entry.alt,
          src: publicUrl(`${base}/${entry.file}`),
          bytes: file ? Math.floor((file.base64.length * 3) / 4) : 0,
        };
      }),
    );

    projects.push({
      id,
      nome: details.nome || id,
      tipo: details.tipo || "Celebracao",
      photos: listed,
    });
  }

  return projects;
}

/** GET /admin/api/portfolio */

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json({ projects: await readPortfolio() });
  } catch (error) {
    return NextResponse.json(
      { erro: error instanceof Error ? error.message : "Falha ao ler o repositorio." },
      { status: 502 },
    );
  }
}

/** POST /admin/api/portfolio — cria um projeto novo, vazio. */

export async function POST(request: Request): Promise<NextResponse> {
  let body: { id?: unknown; nome?: unknown; tipo?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ erro: "Requisicao invalida." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim().toLowerCase() : "";
  const nome = cleanText(body.nome, MAX_TEXT_LENGTH);
  const tipo = cleanText(body.tipo, MAX_TEXT_LENGTH) || "Celebracao";

  if (!isValidProjectId(id)) {
    return NextResponse.json(
      { erro: "Nome de pasta invalido. Use so minusculas, numeros e hifens (ex.: projeto-08)." },
      { status: 400 },
    );
  }

  if (nome === "") {
    return NextResponse.json({ erro: "Escreva o nome do projeto." }, { status: 400 });
  }

  try {
    if (await getFile(`${FOLDER_PREFIX}/${id}/${INFO_FILE}`)) {
      return NextResponse.json({ erro: `Ja existe um projeto com essa pasta (${id}).` }, { status: 409 });
    }

    await putFile(
      `${FOLDER_PREFIX}/${id}/${INFO_FILE}`,
      Buffer.from(serializeInfo({ nome, tipo }), "utf8").toString("base64"),
      `feat(portfolio): cria o projeto ${nome}`,
    );
    await putFile(
      `${FOLDER_PREFIX}/${id}/${ORDER_FILE}`,
      Buffer.from(serializePhotoList([]), "utf8").toString("base64"),
      `feat(portfolio): cria a lista de fotos do projeto ${nome}`,
    );

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { erro: error instanceof Error ? error.message : "Falha ao criar o projeto." },
      { status: 502 },
    );
  }
}
