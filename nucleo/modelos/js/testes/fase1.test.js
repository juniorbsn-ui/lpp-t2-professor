import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { carregarContexto, esperadosDoAluno, hashCurto, deepFreeze } from '../nucleo/util.mjs';
import { PROVAS } from '../nucleo/provas.mjs';
import * as m from '../src/fase1.js';
import { EVENTOS, ITENS, USUARIOS } from './_dados.js';

const CTX = carregarContexto();
const REGRAS = CTX.regras;
const ESP = esperadosDoAluno(CTX.matricula) ?? {};
const congelado = (x) => deepFreeze(structuredClone(x)); // se a função tentar alterar, o Node lança erro

test('padronizar nomes devolve lista nova', () => {
  const saida = m.{{fn.padronizar_nomes}}(congelado(USUARIOS));
  const esperado = { maiusculas: ['ANA SILVA', 'BIA LIMA', 'CAIO REIS'], minusculas: ['ana silva', 'bia lima', 'caio reis'] }[REGRAS.formato_nome];
  assert.deepEqual(saida.map((u) => u.nome), esperado);
});

test('registrar evento devolve objeto novo', () => {
  const novo = m.{{fn.registrar_evento}}(congelado(EVENTOS[0]), 5);
  assert.equal(novo.medida, 35);
});

test('próximo código é determinístico (sem estado escondido)', () => {
  const esperado = 10 + REGRAS.passo_codigo;
  assert.equal(m.{{fn.proximo_codigo}}(10), esperado);
  assert.equal(m.{{fn.proximo_codigo}}(10), esperado);
});

test('ordenar por preço sem alterar a original', () => {
  const saida = m.{{fn.ordenar_itens}}(congelado(ITENS));
  const esperado = { crescente: [1, 3, 2], decrescente: [2, 3, 1] }[REGRAS.ordem_preco];
  assert.deepEqual(saida.map((i) => i.id), esperado);
});

test('prova real com os seus dados', () => {
  assert.ok(ESP.fase1, 'Matrícula não consta na turma: avise o professor.');
  assert.equal(hashCurto(PROVAS.fase1(m, CTX)), ESP.fase1, 'O resultado com os SEUS dados e regras ainda não confere.');
});
