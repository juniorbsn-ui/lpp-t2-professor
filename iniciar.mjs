#!/usr/bin/env node
// Prepara o seu Trabalho 02: sorteia o universo pela matrícula e gera dados, roteiros, esqueletos e testes.
//
// Uso:
//   node iniciar.mjs                 # pergunta a matrícula
//   node iniciar.mjs 1234567         # informa a matrícula direto
//   node iniciar.mjs --forcar        # regenera contexto, roteiros e testes (nunca apaga o seu código em src/)
//   node iniciar.mjs --recriar-src   # recria os esqueletos de src/ (CUIDADO: apaga o que você escreveu)
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { gerar } from './nucleo/gerador.mjs';
import { esperadosDoAluno, renderizar } from './nucleo/util.mjs';

const RAIZ = dirname(fileURLToPath(import.meta.url));
const MODELOS = join(RAIZ, 'nucleo', 'modelos');
const LINGUAGEM = 'node';

const escrever = (caminho, texto) => {
  mkdirSync(dirname(caminho), { recursive: true });
  writeFileSync(caminho, texto, 'utf8');
};
const listar = (dir, ext) => readdirSync(dir).filter((f) => f.endsWith(ext)).sort();

const argv = process.argv.slice(2);
const forcar = argv.includes('--forcar');
const recriarSrc = argv.includes('--recriar-src');
const args = argv.filter((a) => !a.startsWith('--'));

const cfgPath = join(RAIZ, 't2.config.json');
const cfg = existsSync(cfgPath) ? JSON.parse(readFileSync(cfgPath, 'utf8')) : {};

let matricula = (args[0] ?? cfg.matricula ?? '').trim();
if (!matricula) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  matricula = (await rl.question('Digite a sua matrícula (só números): ')).trim();
  rl.close();
}
const sair = (msg) => { console.error(msg); process.exit(1); };
if (!/^\d+$/.test(matricula)) sair('Matrícula inválida: use apenas números.');
if (cfg.matricula && cfg.matricula !== matricula && !forcar) sair(`Este repositório já foi iniciado com outra matrícula (${cfg.matricula}). Use --forcar se tiver certeza.`);
if (cfg.linguagem && cfg.linguagem !== LINGUAGEM && !forcar) sair(`Este repositório já foi iniciado em ${cfg.linguagem}. Use --forcar para trocar para ${LINGUAGEM}.`);

const ctx = gerar(matricula);
escrever(join(RAIZ, 'contexto', 'dados.json'), JSON.stringify(ctx, null, 1) + '\n');
escrever(cfgPath, JSON.stringify({ matricula, linguagem: LINGUAGEM }, null, 2) + '\n');

// roteiros (fases/*.md) e contexto/CONTEXTO.md
for (const nome of listar(join(MODELOS, 'docs'), '.md')) {
  const texto = renderizar(readFileSync(join(MODELOS, 'docs', nome), 'utf8'), ctx, LINGUAGEM);
  escrever(nome === 'CONTEXTO.md' ? join(RAIZ, 'contexto', nome) : join(RAIZ, 'fases', nome), texto);
}

// testes: sempre regenerados (são do professor)
for (const nome of listar(join(MODELOS, 'js', 'testes'), '.js')) {
  escrever(join(RAIZ, 'testes', nome), renderizar(readFileSync(join(MODELOS, 'js', 'testes', nome), 'utf8'), ctx, LINGUAGEM));
}

// esqueletos: só cria o que ainda não existe (seu código é sagrado)
let criados = 0;
for (const nome of listar(join(MODELOS, 'js', 'src'), '.js')) {
  const destino = join(RAIZ, 'src', nome);
  if (recriarSrc || !existsSync(destino)) {
    escrever(destino, renderizar(readFileSync(join(MODELOS, 'js', 'src', nome), 'utf8'), ctx, LINGUAGEM));
    criados++;
  }
}

const justificativa = join(RAIZ, 'JUSTIFICATIVA.md');
if (!existsSync(justificativa)) escrever(justificativa, readFileSync(join(MODELOS, 'JUSTIFICATIVA.md'), 'utf8'));
escrever(join(RAIZ, 'treino', '.gitkeep'), '');

console.log(`${ctx.universo.emoji}  Universo sorteado: ${ctx.universo.marca}`);
console.log(`Matrícula ${matricula} | esqueletos criados: ${criados}`);
if (!esperadosDoAluno(matricula)) console.log('ATENÇÃO: esta matrícula não consta na turma. Confira o número ou avise o professor.');
console.log('\nPróximo passo: abra fases/00-ligar-os-servidores.md e contexto/CONTEXTO.md');
