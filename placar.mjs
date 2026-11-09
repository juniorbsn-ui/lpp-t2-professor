#!/usr/bin/env node
// Placar do Trabalho 02: roda os testes fase a fase, mostra XP e distintivos e salva progresso.json.
//
// Uso:
//   node placar.mjs          # roda até a primeira fase que falhar
//   node placar.mjs --tudo   # roda todas as fases, mesmo as bloqueadas
//   node placar.mjs --json   # imprime só o resultado em JSON (usado na correção em lote)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from 'node:test';
import { carregarContexto, carregarJson, codigoVitoria, esperadosDoAluno } from './nucleo/util.mjs';

const RAIZ = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const tudo = argv.includes('--tudo');
const soJson = argv.includes('--json');

async function rodarFase(fid) {
  const falhas = [];
  let testes = 0;
  const stream = run({ files: [join(RAIZ, 'testes', `${fid}.test.js`)], concurrency: false });
  for await (const ev of stream) {
    if (ev.type !== 'test:pass' && ev.type !== 'test:fail') continue;
    if (ev.data.nesting !== 0) continue;
    testes++;
    if (ev.type === 'test:fail') {
      const e = ev.data.details?.error;
      const c = e?.cause ?? e;
      const fmt = (x) => JSON.stringify(x)?.slice(0, 70);
      let msg = String(c?.message ?? 'falhou').split('\n')[0];
      if (c?.code === 'ERR_ASSERTION' && c.generatedMessage) msg = `esperado ${fmt(c.expected)} e veio ${fmt(c.actual)}`;
      falhas.push([ev.data.name, /Implemente/.test(msg) ? 'ainda não implementada' : msg.slice(0, 220)]);
    }
  }
  return { ok: falhas.length === 0 && testes > 0, testes, falhas };
}

if (!existsSync(join(RAIZ, 'contexto', 'dados.json'))) {
  console.error('Rode primeiro:  node iniciar.mjs');
  process.exit(1);
}
const cfg = carregarJson(join(RAIZ, 't2.config.json'));
const ctx = carregarContexto();
const fases = carregarJson(join(RAIZ, 'nucleo', 'modelos', 'fases.json'));
const esperado = esperadosDoAluno(ctx.matricula) ?? {};

const resultados = {};
let liberada = true;
for (const fase of fases) {
  if (liberada || tudo) {
    resultados[fase.id] = await rodarFase(fase.id);
    liberada = liberada && resultados[fase.id].ok;
  }
}

const xp = fases.filter((f) => resultados[f.id]?.ok).reduce((a, f) => a + f.xp, 0);
const xpTotal = fases.reduce((a, f) => a + f.xp, 0);
const vitoria = resultados.chefao?.ok ? codigoVitoria(ctx.matricula, esperado.chefao) : null;
const progresso = {
  matricula: ctx.matricula, linguagem: cfg.linguagem, universo: ctx.universo.marca,
  fases: Object.fromEntries(Object.entries(resultados).map(([k, v]) => [k, { ok: v.ok, testes: v.testes, falhas: v.falhas.length }])),
  xp, xp_total: xpTotal, vitoria, gerado_em: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
};
writeFileSync(join(RAIZ, 'progresso.json'), JSON.stringify(progresso, null, 2) + '\n', 'utf8');

if (soJson) {
  console.log(JSON.stringify(progresso));
} else {
  const pad = (s, n) => s.padEnd(n);
  console.log(`\n${ctx.universo.emoji}  ${ctx.universo.marca} — Trabalho 02 | matrícula ${ctx.matricula}\n`);
  let primeiraFalha = null;
  for (const fase of fases) {
    const r = resultados[fase.id];
    if (!r) console.log(`  🔒  ${pad(fase.titulo, 34)} ${String(fase.xp).padStart(4)} XP`);
    else if (r.ok) console.log(`  ✅  ${pad(fase.titulo, 34)} ${String(fase.xp).padStart(4)} XP  ${fase.distintivo}`);
    else {
      console.log(`  ❌  ${pad(fase.titulo, 34)} ${String(fase.xp).padStart(4)} XP  (${r.falhas.length} de ${r.testes} testes falharam)`);
      primeiraFalha ??= [fase, r];
    }
  }
  console.log(`\n  XP: ${xp} / ${xpTotal}`);
  if (primeiraFalha) {
    const [fase, r] = primeiraFalha;
    console.log(`\n  O que ajustar em "${fase.titulo}":`);
    r.falhas.forEach(([nome, msg]) => console.log(`   • ${nome} — ${msg}`));
    console.log(`\n  Roteiro: fases/${fase.arquivo}.md`);
  } else if (vitoria) {
    console.log(`\n  👑  TRABALHO COMPLETO! Código de vitória: ${vitoria}`);
    console.log('      Faça o commit, o push e compartilhe o repositório com o professor.');
  }
  console.log();
}
