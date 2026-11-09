// Fase 4 — A esteira de curadoria (composição de funções)
// Regras: SEM for/while, SEM alterar os dados recebidos.
// ATENÇÃO: cada aluno tem REGRAS INDIVIDUAIS (veja contexto/CONTEXTO.md). As suas estão nos textos abaixo.

/** Devolve uma função que passa o valor pela 1ª função, o resultado pela 2ª, e assim por diante. pipe(f, g, h)(x) === h(g(f(x))) */
export const pipe = (...funcoes) => {
  throw new Error('Implemente pipe');
};

/**
 * Remove os {{eventos_r}} inválidos.
 * Regra individual limiar_medida = **{{regra.limiar_medida}}**: descarte quem tem "medida" menor que {{regra.limiar_medida}}.
 */
export const {{fn.passo_limpar}} = (eventos) => {
  throw new Error('Implemente {{fn.passo_limpar}}');
};

/** Remove {{eventos_r}} repetidos (objetos com todos os campos iguais), mantendo a PRIMEIRA ocorrência e a ordem original. */
export const {{fn.passo_deduplicar}} = (eventos) => {
  throw new Error('Implemente {{fn.passo_deduplicar}}');
};

/**
 * Devolve uma função f(eventos) -> os `n` {{usuarios_r}} mais engajados, no formato [[idUsuario, pontos], ...].
 * Regra individual criterio_ranking = **{{regra.criterio_ranking}}**:
 *   medida     -> pontos = soma da "medida"
 *   frequencia -> pontos = QUANTIDADE de {{eventos_r}} (cada registro vale 1)
 * Ordem: mais pontos primeiro; empate: menor id primeiro.
 */
export const {{fn.passo_ranquear}} = (n) => {
  throw new Error('Implemente {{fn.passo_ranquear}}');
};

/** Devolve a esteira completa: limpar -> deduplicar -> ranquear(n), montada com pipe. */
export const {{fn.montar_esteira}} = (n) => {
  throw new Error('Implemente {{fn.montar_esteira}}');
};
