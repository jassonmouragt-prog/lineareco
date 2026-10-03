/**
 * Acesso aos arquivos do repositorio pela API do GitHub.
 *
 * O painel escreve direto nas pastas de projeto, que continuam sendo a fonte da
 * verdade no GitHub. Assim a action "Sincronizar portfolio" continua funcionando
 * e o portfólio inteiro continua auditável no repositorio.
 *
 * Exige uma PAT (fine-grained) com Contents: read and write no repositorio.
 * Nao serve o GITHUB_TOKEN do proprio repositorio: push feito com ele nao
 * dispara as actions.
 */

const REPO = process.env.GITHUB_REPO ?? "jassonmouragt-prog/lineareco";
const BRANCH = process.env.GITHUB_BRANCH ?? "master";
const API = "https://api.github.com";

export interface RepoFile {
  sha: string;
  /** Base64, ja decodificado para texto. Vazio quando o arquivo e binario. */
  text: string;
  /** Base64 cru, para quando o chamador quiser os bytes. */
  base64: string;
}

function headers(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN ausente. O painel nao consegue ler nem escrever no repositorio.");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "linear-admin",
  };
}

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { ...headers(), ...(init.headers ?? {}) },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`GitHub ${response.status} em ${path}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }

  return response;
}

interface EntradaGitHub {
  type: string;
  name: string;
}

async function listar(path: string): Promise<EntradaGitHub[]> {
  return request(
    `/repos/${REPO}/contents/${encodePath(path)}?ref=${BRANCH}`,
  ).then((response) => response.json() as Promise<EntradaGitHub[]>);
}

/** Nomes dos arquivos (ignora subpastas). */
export async function listDirectory(path: string): Promise<string[]> {
  return (await listar(path))
    .filter((entry) => entry.type === "file")
    .map((entry) => entry.name);
}

/**
 * Nomes das subpastas. Precisa existir separada de listDirectory: a raiz do
 * portfolio so tem pastas, e filtrar por "file" devolveria lista vazia.
 */
export async function listFolders(path: string): Promise<string[]> {
  return (await listar(path))
    .filter((entry) => entry.type === "dir")
    .map((entry) => entry.name);
}

export async function getFile(path: string): Promise<RepoFile | null> {
  const response = await fetch(
    `${API}/repos/${REPO}/contents/${encodePath(path)}?ref=${BRANCH}`,
    { headers: headers(), cache: "no-store" },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`GitHub ${response.status} em ${path}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }

  const data = (await response.json()) as { sha: string; content: string; encoding: string };

  return {
    sha: data.sha,
    base64: data.content.replace(/\n/g, ""),
    text: data.encoding === "base64" ? Buffer.from(data.content, "base64").toString("utf8") : data.content,
  };
}

/**
 * Cria ou sobrescreve um arquivo.
 *
 * O `sha` e obrigatorio para sobrescrever: sem ele a API devolve 422. Ler o
 * arquivo antes e passar o sha junto e o que faz a edicao de nome e de ordem
 * funcionar, e e o que impede sobrescrever uma versao concorrente.
 */
export async function putFile(
  path: string,
  base64: string,
  message: string,
  sha?: string,
): Promise<void> {
  await request(`/repos/${REPO}/contents/${encodePath(path)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: base64,
      branch: BRANCH,
      ...(sha === undefined ? {} : { sha }),
    }),
  });
}

export async function deleteFile(path: string, sha: string, message: string): Promise<void> {
  await request(`/repos/${REPO}/contents/${encodePath(path)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
}

/** Move um arquivo deletando e recriando. GitHub nao tem rename na Contents API. */
export async function moveFile(
  from: string,
  to: string,
  base64: string,
  message: string,
): Promise<void> {
  const existing = await getFile(from);
  await putFile(to, base64, message);
  if (existing) {
    await deleteFile(from, existing.sha, message);
  }
}

function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

export { REPO, BRANCH };
