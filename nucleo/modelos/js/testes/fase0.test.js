import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carregarContexto, esperadosDoAluno, hashCurto } from '../nucleo/util.mjs';
import { gerar } from '../nucleo/gerador.mjs';
import * as m from '../src/fase0.js';

const CTX = carregarContexto();

test('boas-vindas com a sua marca', () => {
  assert.equal(m.boasVindas('{{marca}}'), 'Servidores da {{marca}} no ar!');
});

test('boas-vindas usa o parâmetro', () => {
  assert.equal(m.boasVindas('Teste'), 'Servidores da Teste no ar!');
});

test('a matrícula consta na turma', () => {
  assert.ok(esperadosDoAluno(CTX.matricula), 'Matrícula não consta na turma. Confira t2.config.json ou avise o professor.');
});

test('o contexto não foi adulterado', () => {
  assert.equal(hashCurto(gerar(CTX.matricula), 16), hashCurto(CTX, 16),
    'contexto/dados.json foi alterado. Rode `node iniciar.mjs --forcar` para regenerar.');
});
