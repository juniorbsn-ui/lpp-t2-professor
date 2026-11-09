// Fase 1 — A caça às funções impuras
//
// As 4 funções abaixo foram herdadas do código antigo e estão CONTAMINADAS:
// elas alteram dados que não são delas ou dependem de estado escondido.
// Sua missão: reescrever cada uma como FUNÇÃO PURA (mesma entrada => mesma saída, sem efeitos colaterais).
//
// ATENÇÃO: cada aluno tem REGRAS INDIVIDUAIS (veja contexto/CONTEXTO.md). As suas estão nos textos abaixo.

let contador = 0; // estado escondido (global) — um dos vilões desta fase

/**
 * Devolve uma NOVA lista de {{usuarios_r}} com o campo "nome" em **{{regra.formato_nome}}**
 * (maiusculas = MAIÚSCULAS; minusculas = minúsculas). Não pode alterar a lista original.
 */
export function {{fn.padronizar_nomes}}(lista) {
  lista.forEach((u) => {
    u.nome = u.nome.toUpperCase();
  });
  return lista;
}

/** Devolve um NOVO registro de {{evento_r}} com "medida" aumentada em `extra` ({{medida_r}}). Não pode alterar o original. */
export function {{fn.registrar_evento}}(evento, extra) {
  evento.medida += extra;
  return evento;
}

/**
 * Devolve o código do próximo registro de {{evento_r}}: ultimo + {{regra.passo_codigo}} (regra individual).
 * A mesma entrada deve dar sempre a mesma saída.
 */
export function {{fn.proximo_codigo}}(ultimo) {
  contador += {{regra.passo_codigo}};
  return ultimo + contador;
}

/**
 * Devolve uma NOVA lista de {{itens_r}} ordenada por preço em ordem **{{regra.ordem_preco}}**;
 * em empate, menor id primeiro. Não altera a original.
 */
export function {{fn.ordenar_itens}}(itens) {
  return itens.sort((a, b) => a.preco - b.preco || a.id - b.id);
}
