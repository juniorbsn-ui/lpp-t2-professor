import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ, carregarContexto, esperadosDoAluno, hashCurto, deepFreeze, problemasDeEstiloJs } from '../nucleo/util.mjs';
import { PROVAS } from '../nucleo/provas.mjs';
import * as m from '../src/fase5.js';

const CTX = carregarContexto();
const REGRAS = CTX.regras;
const V = REGRAS.velocidade;
const MAXIMO = REGRAS.posicao_maxima;
const ESP = esperadosDoAluno(CTX.matricula) ?? {};
const INICIAL = deepFreeze({ item: 1, posicao: 0, tocando: false, trocas: 0 });
const cmd = (tipo, valor = null) => deepFreeze({ tipo, valor });

test('iniciar e pausar', () => {
  assert.equal(m.{{fn.aplicar_comando}}(INICIAL, cmd('iniciar')).tocando, true);
  assert.equal(m.{{fn.aplicar_comando}}({ ...INICIAL, tocando: true }, cmd('pausar')).tocando, false);
});

test('avançar e voltar', () => {
  assert.equal(m.{{fn.aplicar_comando}}(INICIAL, cmd('avancar', 30)).posicao, Math.min(MAXIMO, 30 * V));
  assert.equal(m.{{fn.aplicar_comando}}({ ...INICIAL, posicao: 20 }, cmd('voltar', 5)).posicao, 15);
});

test('avançar nunca passa da posição máxima', () => {
  assert.equal(m.{{fn.aplicar_comando}}(INICIAL, cmd('avancar', 100000)).posicao, MAXIMO);
});

test('voltar nunca fica negativo', () => {
  assert.equal(m.{{fn.aplicar_comando}}({ ...INICIAL, posicao: 10 }, cmd('voltar', 100)).posicao, 0);
});

test('trocar', () => {
  assert.deepEqual(m.{{fn.aplicar_comando}}({ ...INICIAL, posicao: 50 }, cmd('trocar', 7)),
    { item: 7, posicao: 0, tocando: true, trocas: 1 });
});

test('comando desconhecido mantém o estado', () => {
  assert.deepEqual(m.{{fn.aplicar_comando}}(INICIAL, cmd('dancar')), INICIAL);
});

test('estado final', () => {
  const comandos = deepFreeze([cmd('trocar', 2), cmd('avancar', 40), cmd('voltar', 10), cmd('pausar')]);
  assert.deepEqual(m.{{fn.estado_final}}(INICIAL, comandos), { item: 2, posicao: Math.max(0, Math.min(MAXIMO, 40 * V) - 10), tocando: false, trocas: 1 });
});

test('estilo funcional (sem laços, sem push, sem mutação)', () => {
  const problemas = problemasDeEstiloJs(readFileSync(join(RAIZ, 'src', 'fase5.js'), 'utf8'));
  assert.deepEqual(problemas, [], 'Estilo funcional: ' + problemas.join('; '));
});

test('prova real com os seus dados', () => {
  assert.ok(ESP.fase5, 'Matrícula não consta na turma: avise o professor.');
  assert.equal(hashCurto(PROVAS.fase5(m, CTX)), ESP.fase5, 'O resultado com os SEUS dados e regras ainda não confere.');
});
