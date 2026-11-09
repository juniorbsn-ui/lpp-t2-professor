import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ, carregarContexto, esperadosDoAluno, hashCurto, deepFreeze, problemasDeEstiloJs } from '../nucleo/util.mjs';
import { PROVAS } from '../nucleo/provas.mjs';
import * as m from '../src/fase3.js';
import { ITENS, USUARIOS } from './_dados.js';

const CTX = carregarContexto();
const REGRAS = CTX.regras;
const ESP = esperadosDoAluno(CTX.matricula) ?? {};
const itens = deepFreeze(structuredClone(ITENS));
const usuarios = deepFreeze(structuredClone(USUARIOS));

test('filtro por {{categoria_r}}', () => {
  const filtro = m.{{fn.criar_filtro_categoria}}('cat1');
  assert.deepEqual(itens.map((i) => filtro(i)), [true, true, false]);
});

test('restrição de classificação', () => {
  const liberado = m.{{fn.criar_restricao}}(12); // classificações dos exemplos: 0, 12 e 16
  const esperado = { ate: [true, true, false], abaixo: [true, false, false] }[REGRAS.restricao];
  assert.deepEqual(itens.map((i) => liberado(i)), esperado);
});

test('desconto', () => {
  const desconto = m.{{fn.criar_desconto}}(20);
  assert.equal(desconto(1000), 800); // divisão exata: não depende do arredondamento
  assert.equal(desconto(1999), { baixo: 1599, cima: 1600 }[REGRAS.arredondamento]);
});

test('promoção de aniversário', () => {
  const promo = m.{{fn.criar_promo}}(3, 50); // meses de aniversário dos exemplos: 3, 5 e 2
  const esperado = REGRAS.promo_alvo === 'mes_do_aniversario' ? [5000, 10000, 10000] : [10000, 10000, 5000];
  assert.deepEqual(usuarios.map((u) => promo(u, 10000)), esperado);
});

test('promoção usa o arredondamento', () => {
  const promo = m.{{fn.criar_promo}}(3, 50);
  const alvo = REGRAS.promo_alvo === 'mes_do_aniversario' ? usuarios[0] : usuarios[2];
  assert.equal(promo(alvo, 999), { baixo: 499, cima: 500 }[REGRAS.arredondamento]);
});

test('closures são independentes', () => {
  const d10 = m.{{fn.criar_desconto}}(10);
  const d50 = m.{{fn.criar_desconto}}(50);
  assert.deepEqual([d10(1000), d50(1000)], [900, 500]);
});

test('estilo funcional (sem laços, sem push, sem mutação)', () => {
  const problemas = problemasDeEstiloJs(readFileSync(join(RAIZ, 'src', 'fase3.js'), 'utf8'));
  assert.deepEqual(problemas, [], 'Estilo funcional: ' + problemas.join('; '));
});

test('prova real com os seus dados', () => {
  assert.ok(ESP.fase3, 'Matrícula não consta na turma: avise o professor.');
  assert.equal(hashCurto(PROVAS.fase3(m, CTX)), ESP.fase3, 'O resultado com os SEUS dados e regras ainda não confere.');
});
