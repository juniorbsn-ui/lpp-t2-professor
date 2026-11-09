import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ, carregarContexto, esperadosDoAluno, hashCurto, deepFreeze, problemasDeEstiloJs } from '../nucleo/util.mjs';
import { PROVAS } from '../nucleo/provas.mjs';
import * as m from '../src/fase4.js';
import { EVENTOS, ev } from './_dados.js';

const CTX = carregarContexto();
const REGRAS = CTX.regras;
const ESP = esperadosDoAluno(CTX.matricula) ?? {};
const L = REGRAS.limiar_medida; // a sua regra individual: descarta medida < L
const BRUTOS = [
  ev(2, 1, L + 40), ev(2, 2, L + 20),
  ev(1, 1, L + 10, 2), ev(1, 1, L + 10, 2), // repetido
  ev(3, 1, 0), ev(3, 2, Math.max(L - 1, 0)), // inválidos (abaixo do limiar)
];
const congelado = (x) => deepFreeze(structuredClone(x));

test('pipe respeita a ordem', () => {
  assert.equal(m.pipe((x) => x + 1, (x) => x * 2)(3), 8); // (3+1)*2, e não 3*2+1
});

test('pipe sem funções devolve o valor', () => {
  assert.equal(m.pipe()(42), 42);
});

test('limpar respeita o limiar', () => {
  const entrada = [ev(1, 1, 0), ev(1, 1, Math.max(L - 1, 0)), ev(1, 1, L), ev(1, 1, L + 5)];
  assert.deepEqual(m.{{fn.passo_limpar}}(congelado(entrada)).map((e) => e.medida), [L, L + 5]);
});

test('deduplicar mantém a primeira ocorrência', () => {
  const [a, b, c] = [ev(1, 1, 10), ev(2, 1, 20), ev(3, 1, 30)];
  assert.deepEqual(m.{{fn.passo_deduplicar}}(congelado([a, b, a, c, b])), [a, b, c]);
});

test('ranquear', () => {
  const esperado = { medida: [[2, 90], [1, 50]], frequencia: [[1, 2], [2, 2]] }[REGRAS.criterio_ranking];
  assert.deepEqual(m.{{fn.passo_ranquear}}(2)(congelado(EVENTOS)).map((p) => [...p]), esperado);
});

test('esteira completa', () => {
  const esperado = { medida: [[2, 2 * L + 60]], frequencia: [[2, 2]] }[REGRAS.criterio_ranking];
  assert.deepEqual(m.{{fn.montar_esteira}}(1)(congelado(BRUTOS)).map((p) => [...p]), esperado);
});

test('estilo funcional (sem laços, sem push, sem mutação)', () => {
  const problemas = problemasDeEstiloJs(readFileSync(join(RAIZ, 'src', 'fase4.js'), 'utf8'));
  assert.deepEqual(problemas, [], 'Estilo funcional: ' + problemas.join('; '));
});

test('prova real com os seus dados', () => {
  assert.ok(ESP.fase4, 'Matrícula não consta na turma: avise o professor.');
  assert.equal(hashCurto(PROVAS.fase4(m, CTX)), ESP.fase4, 'O resultado com os SEUS dados e regras ainda não confere.');
});
