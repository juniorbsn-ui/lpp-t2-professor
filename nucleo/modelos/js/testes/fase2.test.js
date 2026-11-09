import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ, carregarContexto, esperadosDoAluno, hashCurto, deepFreeze, problemasDeEstiloJs } from '../nucleo/util.mjs';
import { PROVAS } from '../nucleo/provas.mjs';
import * as m from '../src/fase2.js';
import { EVENTOS, ITENS, USUARIOS } from './_dados.js';

const CTX = carregarContexto();
const REGRAS = CTX.regras;
const ESP = esperadosDoAluno(CTX.matricula) ?? {};
const congelado = (x) => deepFreeze(structuredClone(x));

test('total por {{categoria_r}} (sem alterar as entradas)', () => {
  assert.deepEqual(m.{{fn.total_por_categoria}}(congelado(EVENTOS), congelado(ITENS)), { cat1: 100, cat2: 40 });
});

test('{{itens_r}} mais populares', () => {
  const esperado = { medida: [2, 3], frequencia: [2, 1] }[REGRAS.criterio_ranking];
  assert.deepEqual([...m.{{fn.itens_populares}}(congelado(EVENTOS), 2)], esperado);
});

test('{{usuarios_r}} inativos', () => {
  const esperado = { 4: [3], 5: [3], 6: [1, 3], 7: [1, 3], 8: [1, 3], 9: [1, 2, 3] }[REGRAS.mes_inatividade];
  assert.deepEqual([...m.{{fn.usuarios_inativos}}(congelado(USUARIOS), congelado(EVENTOS))], esperado);
});

test('nota média por {{categoria_r}} (x100)', () => {
  const esperado = { 1: { cat1: 333, cat2: 200 }, 2: { cat1: 450, cat2: 200 }, 3: { cat1: 450 } }[REGRAS.nota_min];
  assert.deepEqual(m.{{fn.nota_media_por_categoria}}(congelado(EVENTOS), congelado(ITENS)), esperado);
});

test('estilo funcional (sem laços, sem push, sem mutação)', () => {
  const problemas = problemasDeEstiloJs(readFileSync(join(RAIZ, 'src', 'fase2.js'), 'utf8'));
  assert.deepEqual(problemas, [], 'Estilo funcional: ' + problemas.join('; '));
});

test('prova real com os seus dados', () => {
  assert.ok(ESP.fase2, 'Matrícula não consta na turma: avise o professor.');
  assert.equal(hashCurto(PROVAS.fase2(m, CTX)), ESP.fase2, 'O resultado com os SEUS dados e regras ainda não confere.');
});
