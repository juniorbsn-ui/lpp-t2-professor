import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ, carregarContexto, esperadosDoAluno, hashCurto, deepFreeze, problemasDeEstiloJs } from '../nucleo/util.mjs';
import { PROVAS } from '../nucleo/provas.mjs';
import * as m from '../src/chefao.js';
import { ITENS, ev } from './_dados.js';

const CTX = carregarContexto();
const REGRAS = CTX.regras;
const ESP = esperadosDoAluno(CTX.matricula) ?? {};
const L = REGRAS.limiar_medida;
const BRUTOS = deepFreeze([
  ev(1, 1, L + 10, 1), ev(2, 2, L + 20, 1), ev(1, 3, L + 50, 2),
  ev(1, 1, L + 10, 1), // repetido
  ev(3, 1, 0, 1), // inválido
]);
const itens = deepFreeze(structuredClone(ITENS));

test('relatório de um mês com dados', () => {
  const r = m.{{fn.gerar_relatorio}}(BRUTOS, itens, 1, 1);
  assert.equal(r.mes, 1);
  assert.equal(r.total, 2 * L + 30);
  assert.deepEqual([...r.categoria_lider], ['cat1', 2 * L + 30]);
  const esperado = { medida: [[2, L + 20]], frequencia: [[1, 1]] }[REGRAS.criterio_ranking];
  assert.deepEqual(r.engajados.map((p) => [...p]), esperado);
});

test('relatório de um mês sem {{eventos_r}}', () => {
  const r = m.{{fn.gerar_relatorio}}(BRUTOS, itens, 12, 3);
  assert.equal(r.total, 0);
  assert.equal(r.categoria_lider, null);
  assert.deepEqual([...r.engajados], []);
});

test('estilo funcional (sem laços, sem push, sem mutação)', () => {
  const problemas = problemasDeEstiloJs(readFileSync(join(RAIZ, 'src', 'chefao.js'), 'utf8'));
  assert.deepEqual(problemas, [], 'Estilo funcional: ' + problemas.join('; '));
});

test('relatório real com os seus dados', () => {
  assert.ok(ESP.chefao, 'Matrícula não consta na turma: avise o professor.');
  assert.equal(hashCurto(PROVAS.chefao(m, CTX)), ESP.chefao, 'O relatório com os SEUS dados e regras ainda não confere.');
});
