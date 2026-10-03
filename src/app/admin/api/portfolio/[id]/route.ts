import { NextResponse } from "next/server";

import { deleteFile, getFile, listDirectory, putFile } from "@/lib/admin/github";
import {
  FOLDER_PREFIX,
  INFO_FILE,
  MAX_TEXT_LENGTH,
  ORDER_FILE,
  cleanText,
  isValidPhotoFile,
  isValidProjectId,
  mergeOrder,
  parsePhotoList,
  serializeInfo,
  serializePhotoList,
} from "@/lib/admin/portfolio";

type Context = { params: Promise<{ id: string }> };

function notFound(): NextResponse {
  return NextResponse.json({ erro: "Projeto não encontrado." }, { status: 404 });
}

function badRequest(message: string): NextResponse {
  return NextResponse.json({ erro: message }, { status: 400 });
}

/** PUT /admin/api/portfolio/[id] — salva nome, tipo e a ordem das fotos. */

export async function PUT(request: Request, context: Context): Promise<NextResponse> {
  const { id } = await context.params;
  if (!isValidProjectId(id)) return notFound();

  let body: { nome?: unknown; tipo?: unknown; order?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest("Requisição inválida.");
  }

  const nome = cleanText(body.nome, MAX_TEXT_LENGTH);
  const tipo = cleanText(body.tipo, MAX_TEXT_LENGTH) || "Celebração";

  if (nome === "") {
    return badRequest("O nome do projeto não pode ficar vazio.");
  }

  const base = `${FOLDER_PREFIX}/${id}`;

  try {
    const [infoFile, orderFile] = await Promise.all([
      getFile(`${base}/${INFO_FILE}`),
      getFile(`${base}/${ORDER_FILE}`),
    ]);

    // Sem projeto.txt nao ha o que editar; e sem o sha o GitHub recusaria a
    // sobrescrita com 422.
    if (!infoFile) return notFound();

    const filesOnDisk = await listDirectory(base);
    const photos = filesOnDisk.filter((file) => /\.(?:webp|jpg|jpeg|png)$/i.test(file));

    let entries: { file: string; alt: string }[] | null = null;

    if (Array.isArray(body.order)) {
      const order = body.order.filter((file): file is string => isValidPhotoFile(file));
      const unknown = order.filter((file) => !photos.includes(file));

      if (unknown.length > 0) {
        return badRequest(`Foto que não está na pasta: ${unknown.join(", ")}.`);
      }

      const missing = photos.filter((file) => !order.includes(file));
      if (missing.length > 0) {
        return badRequest(`Faltou posicionar: ${missing.join(", ")}.`);
      }

      // A nova ordem vem do painel; as descrições já escritas são preservadas
      // para que trocar a capa não apague o texto de acessibilidade.
      const previous = mergeOrder(photos, parsePhotoList(orderFile?.text ?? null));
      const altByFile = new Map(previous.map((entry) => [entry.file, entry.alt]));

      entries = order.map((file) => ({ file, alt: altByFile.get(file) ?? "" }));
    }

    await putFile(
      `${base}/${INFO_FILE}`,
      Buffer.from(serializeInfo({ nome, tipo }), "utf8").toString("base64"),
      `chore(portfolio): renomeia o projeto para ${nome}`,
      infoFile.sha,
    );

    if (entries !== null) {
      await putFile(
        `${base}/${ORDER_FILE}`,
        Buffer.from(serializePhotoList(entries), "utf8").toString("base64"),
        `chore(portfolio): muda a ordem das fotos de ${nome}`,
        orderFile?.sha,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { erro: error instanceof Error ? error.message : "Falha ao salvar." },
      { status: 502 },
    );
  }
}

/** DELETE /admin/api/portfolio/[id] — apaga a pasta inteira do projeto. */

export async function DELETE(_request: Request, context: Context): Promise<NextResponse> {
  const { id } = await context.params;
  if (!isValidProjectId(id)) return notFound();

  const base = `${FOLDER_PREFIX}/${id}`;

  try {
    const files = await listDirectory(base);
    if (files.length === 0) return notFound();

    for (const file of files) {
      const existing = await getFile(`${base}/${file}`);
      if (!existing) continue;

      await deleteFile(`${base}/${file}`, existing.sha, `chore(portfolio): remove ${file} do projeto ${id}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { erro: error instanceof Error ? error.message : "Falha ao apagar o projeto." },
      { status: 502 },
    );
  }
}
