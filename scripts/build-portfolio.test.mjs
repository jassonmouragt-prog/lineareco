/**
 * Testes do scripts/build-portfolio.mjs.
 *
 * Focam nos erros que alguém de celular comete de verdade: digitar o nome da
 * foto errado, apagar o projeto.txt, subir .heic. O script nao pode quebrar o
 * site por causa disso — ele avisa e segue.
 *
 * O teste mexe de verdade nas pastas de fotos, entao tudo o que ele altera e
 * restaurado no finally, mesmo se um check falhar no meio.
 *
 * Rode com:  npm run portfolio:test
 */

import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const FOLDER = "public/images/portfolio/projeto-02";
const SAMPLE = "public/images/portfolio/projeto-07/01.webp";
const BACKUP = {
  projeto: "projeto.txt.tmp-backup",
  fotos: "fotos.txt.tmp-backup",
};

const generated = () => readFileSync("src/data/gallery.generated.ts", "utf8");
const blockOf = (id) => generated().split(`id: "${id}"`)[1];

const run = () => {
  const result = spawnSync("node", ["scripts/build-portfolio.mjs"], { encoding: "utf8" });
  return { code: result.status, out: `${result.stdout ?? ""}${result.stderr ?? ""}` };
};

const photosOf = () =>
  [...blockOf("projeto-02").matchAll(/src: "\/images\/portfolio\/projeto-02\/([^"]+)"/g)].map(
    (match) => match[1],
  );
const titleOf = () => blockOf("projeto-02").match(/title: "([^"]+)"/)?.[1];

let passed = 0;
let failed = 0;

function check(name, condition, detail) {
  if (condition) {
    passed += 1;
    console.log(`  ok    ${name}`);
  } else {
    failed += 1;
    console.log(`  FALHA ${name}${detail === undefined ? "" : ` -> ${detail}`}`);
  }
}

copyFileSync(`${FOLDER}/projeto.txt`, BACKUP.projeto);
copyFileSync(`${FOLDER}/fotos.txt`, BACKUP.fotos);

try {
  console.log("trocar a capa reordenando linhas do fotos.txt, sem renomear");
  writeFileSync(
    `${FOLDER}/fotos.txt`,
    "04.webp | Detalhe\n01.webp | Decoracao\n02.webp | Ambiente\n03.webp | Arranjos\n",
    "utf8",
  );
  let result = run();
  check("build passou", result.code === 0, `code ${result.code}`);
  check("capa virou 04.webp", photosOf()[0] === "04.webp", photosOf().join(","));
  check("nenhuma foto perdida", photosOf().length === 4, String(photosOf().length));

  console.log("nome do projeto em uma linha");
  writeFileSync(`${FOLDER}/projeto.txt`, "nome: Casamento Ana e Bruno\ntipo: Casamento\n", "utf8");
  result = run();
  check("build passou", result.code === 0, `code ${result.code}`);
  check("titulo aplicado", titleOf() === "Casamento Ana e Bruno", titleOf());

  console.log("nome de foto digitado errado");
  writeFileSync(`${FOLDER}/fotos.txt`, "04.webp | a\n09.webp | b\n01.webp | c\n", "utf8");
  result = run();
  check("build nao quebrou", result.code === 0, `code ${result.code}`);
  check("avisou o arquivo inexistente", result.out.includes("09.webp"));
  check("guardou as 4 fotos", photosOf().length === 4, String(photosOf().length));

  console.log("projeto.txt sem nenhum dois-pontos");
  copyFileSync(BACKUP.fotos, `${FOLDER}/fotos.txt`);
  writeFileSync(`${FOLDER}/projeto.txt`, "qualquer coisa sem dois pontos\n", "utf8");
  result = run();
  check("build nao quebrou", result.code === 0, `code ${result.code}`);
  check("caiu no nome da pasta", titleOf() === "Projeto", titleOf());

  console.log("projeto.txt vazio");
  writeFileSync(`${FOLDER}/projeto.txt`, "", "utf8");
  result = run();
  check("build nao quebrou", result.code === 0, `code ${result.code}`);
  check("caiu no nome da pasta", titleOf() === "Projeto", titleOf());

  console.log("projeto novo: so a pasta com fotos, sem nenhum .txt");
  rmSync(`${FOLDER}/projeto.txt`, { force: true });
  mkdirSync(`${FOLDER}-novo`, { recursive: true });
  copyFileSync(SAMPLE, `${FOLDER}-novo/01.webp`);
  result = run();
  const labels = [...generated().matchAll(/label: "(PROJETO \d\d)"/g)].map((match) => match[1]);
  check("build passou", result.code === 0, `code ${result.code}`);
  check("projeto novo entrou", generated().includes('id: "projeto-02-novo"'));
  check("titulo derivado do nome da pasta", /title: "Projeto Novo"/.test(blockOf("projeto-02-novo")));
  check(
    "numeracao recalculada e sequencial",
    labels.join(",") ===
      "PROJETO 01,PROJETO 02,PROJETO 03,PROJETO 04,PROJETO 05,PROJETO 06,PROJETO 07,PROJETO 08",
    labels.join(","),
  );
  rmSync(`${FOLDER}-novo`, { recursive: true, force: true });

  console.log("foto nova upada mas sem linha no fotos.txt");
  copyFileSync("public/images/portfolio/projeto-07/02.webp", `${FOLDER}/05.webp`);
  result = run();
  check("build passou", result.code === 0, `code ${result.code}`);
  check("avisou que nao esta na lista", result.out.includes("05.webp"));
  check("colocou no fim", photosOf().at(-1) === "05.webp", photosOf().join(","));
  rmSync(`${FOLDER}/05.webp`, { force: true });

  console.log("formato nao suportado precisa travar com explicacao");
  writeFileSync(`${FOLDER}/06.heic`, "x", "utf8");
  result = run();
  check("build falhou", result.code === 1, `code ${result.code}`);
  check("explicou o motivo", result.out.includes("iPhone"));
  rmSync(`${FOLDER}/06.heic`, { force: true });
} finally {
  copyFileSync(BACKUP.projeto, `${FOLDER}/projeto.txt`);
  copyFileSync(BACKUP.fotos, `${FOLDER}/fotos.txt`);
  rmSync(BACKUP.projeto, { force: true });
  rmSync(BACKUP.fotos, { force: true });
}

const restored = run();
check("estado restaurado ao final", restored.code === 0 && restored.out.includes("7 projeto(s), 27 foto(s)"));

console.log(`\n${passed} passaram, ${failed} falharam`);
process.exit(failed === 0 ? 0 : 1);
