import { NextResponse } from "next/server";

import { deleteFile, getFile, listDirectory, putFile } from "@/lib/admin/github";
import {
  FOLDER_PREFIX,
  MAX_ALT_LENGTH,
  ORDER_FILE,
  cleanText,
  isValidProjectId,
  mergeOrder,
  nextPhotoName,
  parsePhotoList,
  serializePhotoList,
} from "@/lib/admin/portfolio";

type Context = { params: Promise<{ id: string }> };

/** Teto do corpo da requisicao. O limite da Vercel e 4.5 MB; aqui fica abaixo. */
const MAX_BYTES = 3 * 1024 * 1024;

const ACCEPTED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/**
 * Le a dimensao direto do cabecalho. Sem isso, o gerador do portfólio quebraria
 * depois, quando a foto ja estivesse no repositorio publico.
 */
function readSize(
  bytes: Uint8Array,
): { width: number; height: number } | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    while (offset + 4 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset += 1; continue; }
      const marker = bytes[offset + 1];
      if (marker === 0xff) { offset += 1; continue; }
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) { offset += 2; continue; }

      const length = view.getUint16(offset + 2);
      if (sof.has(marker)) {
        return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
      }
      offset += 2 + length;
    }
    return null;
  }

  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }

  if (
    bytes.length > 30 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let offset = 12;

    while (offset + 8 <= bytes.length) {
      const type = String.fromCharCode(...bytes.slice(offset, offset + 4));
      const size = view.getUint32(offset + 4, true);
      const body = offset + 8;

      if (type === "VP8X" && body + 10 <= bytes.length) {
        return {
          width: 1 + (bytes[body + 4] | (bytes[body + 5] << 8) | (bytes[body + 6] << 16)),
          height: 1 + (bytes[body + 7] | (bytes[body + 8] << 8) | (bytes[body + 9] << 16)),
        };
      }
      if (type === "VP8L" && body + 5 <= bytes.length) {
        const bits = view.getUint32(body + 1, true);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      if (type === "VP8 " && body + 10 <= bytes.length) {
        return {
          width: view.getUint16(body + 6, true) & 0x3fff,
          height: view.getUint16(body + 8, true) & 0x3fff,
        };
      }
      if (size <= 0) break;
      offset = body + size + (size % 2);
    }
    return null;
  }

  return null;
}

function unsupportedAdvice(fileName: string): string {
  if (/\.(?:heic|heif)$/i.test(fileName)) {
    return "Foto de iPhone em .heic. Abra a foto, Compartilhar > Salvar imagem, e envie o .jpg que o iPhone cria.";
  }
  if (/\.avif$/i.test(fileName)) return "Formato .avif não é suportado. Envie como .jpg ou .png.";
  return "Envie uma imagem .jpg, .png ou .webp.";
}

/** POST /admin/api/portfolio/[id]/photos */

export async function POST(request: Request, context: Context): Promise<NextResponse> {
  const { id } = await context.params;
  if (!isValidProjectId(id)) {
    return NextResponse.json({ erro: "Projeto não encontrado." }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ erro: "Não consegui ler o arquivo enviado." }, { status: 400 });
  }

  const file = form.get("foto");
  if (!(file instanceof File)) {
    return NextResponse.json({ erro: "Nenhuma foto foi enviada." }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ erro: "O arquivo está vazio." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        erro: `A foto tem ${(file.size / 1024 / 1024).toFixed(1)} MB e o limite é 3 MB. ` +
          "Diminua a resolução no celular (configurações > Câmera) ou envie como .jpg.",
      },
      { status: 413 },
    );
  }

  const extension = ACCEPTED[file.type];
  if (!extension) {
    return NextResponse.json({ erro: unsupportedAdvice(file.name) }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const size = readSize(bytes);

  if (!size || size.width < 1 || size.height < 1) {
    return NextResponse.json(
      { erro: "O arquivo não parece ser uma imagem válida (cabeçalho ilegível)." },
      { status: 400 },
    );
  }

  const base = `${FOLDER_PREFIX}/${id}`;
  const alt = cleanText(form.get("alt"), MAX_ALT_LENGTH);

  try {
    const filesOnDisk = await listDirectory(base);
    const photos = filesOnDisk.filter((name) => /\.(?:webp|jpg|jpeg|png)$/i.test(name));

    const name = nextPhotoName(photos);
    if (name === null) {
      return NextResponse.json(
        { erro: "Esse projeto já tem 99 fotos. Crie outro projeto." },
        { status: 409 },
      );
    }

    const orderFile = await getFile(`${base}/${ORDER_FILE}`);
    const previous = mergeOrder(photos, parsePhotoList(orderFile?.text ?? null));
    const fileName = `${name}${extension}`;

    // A foto e arquivo novo: naso tem sha. O fotos.txt ja existe e precisa do
    // sha para ser sobrescrito.
    await putFile(
      `${base}/${fileName}`,
      Buffer.from(bytes).toString("base64"),
      `feat(portfolio): adiciona foto em ${id}`,
    );
    await putFile(
      `${base}/${ORDER_FILE}`,
      Buffer.from(serializePhotoList([...previous, { file: fileName, alt }]), "utf8").toString("base64"),
      `feat(portfolio): inclui a foto nova na lista de ${id}`,
      orderFile?.sha,
    );

    return NextResponse.json(
      { ok: true, file: fileName, src: `/${base}/${fileName}`, width: size.width, height: size.height },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { erro: error instanceof Error ? error.message : "Falha ao enviar a foto." },
      { status: 502 },
    );
  }
}

/** DELETE /admin/api/portfolio/[id]/photos — remove uma foto da pasta e da lista. */

export async function DELETE(request: Request, context: Context): Promise<NextResponse> {
  const { id } = await context.params;
  if (!isValidProjectId(id)) {
    return NextResponse.json({ erro: "Projeto não encontrado." }, { status: 404 });
  }

  const requested = new URL(request.url).searchParams.get("arquivo") ?? "";
  const base = `${FOLDER_PREFIX}/${id}`;

  try {
    const filesOnDisk = await listDirectory(base);
    const target = filesOnDisk.find((file) => file.toLowerCase() === requested.toLowerCase());

    if (target === undefined || !/\.(?:webp|jpg|jpeg|png)$/i.test(target)) {
      return NextResponse.json({ erro: "Foto não encontrada." }, { status: 404 });
    }

    const fotosNaPasta = filesOnDisk.filter((file) => /\.(?:webp|jpg|jpeg|png)$/i.test(file));
    const orderFile = await getFile(`${base}/${ORDER_FILE}`);
    const previous = mergeOrder(fotosNaPasta, parsePhotoList(orderFile?.text ?? null));

    const existing = await getFile(`${base}/${target}`);
    if (existing) {
      await deleteFile(`${base}/${target}`, existing.sha, `chore(portfolio): remove ${target} de ${id}`);
    }

    await putFile(
      `${base}/${ORDER_FILE}`,
      Buffer.from(
        serializePhotoList(previous.filter((entry) => entry.file !== target)),
        "utf8",
      ).toString("base64"),
      `chore(portfolio): tira ${target} da lista de ${id}`,
      orderFile?.sha,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { erro: error instanceof Error ? error.message : "Falha ao remover a foto." },
      { status: 502 },
    );
  }
}
