// Fase 3 — A fábrica de regras (closures e funções que devolvem funções)
// Regras: SEM for/while, SEM alterar os dados recebidos.
// ATENÇÃO: cada aluno tem REGRAS INDIVIDUAIS (veja contexto/CONTEXTO.md). As suas estão nos textos abaixo.

/** Devolve uma função f(item) -> boolean: true quando {{o_item}} pertence à categoria recebida ({{categoria_r}}). */
export const {{fn.criar_filtro_categoria}} = (categoria) => {
  throw new Error('Implemente {{fn.criar_filtro_categoria}}');
};

/**
 * Devolve uma função f(item) -> boolean sobre a "classificacao" {{do_item}}.
 * Regra individual restricao = **{{regra.restricao}}**:
 *   ate    -> true quando classificacao <= limite
 *   abaixo -> true quando classificacao <  limite
 */
export const {{fn.criar_restricao}} = (limite) => {
  throw new Error('Implemente {{fn.criar_restricao}}');
};

/**
 * Devolve uma função f(preco) -> preço com desconto (inteiro, em centavos).
 * Valor exato = preco * (100 - percentual) / 100.
 * Regra individual arredondamento = **{{regra.arredondamento}}**: baixo = arredonda para baixo; cima = arredonda para cima.
 */
export const {{fn.criar_desconto}} = (percentual) => {
  throw new Error('Implemente {{fn.criar_desconto}}');
};

/**
 * Devolve uma função f(usuario, preco) -> preço final.
 * Regra individual promo_alvo = **{{regra.promo_alvo}}**:
 *   mes_do_aniversario -> o desconto vale quando o "mes" {{do_usuario}} é igual a `mes`
 *   mes_seguinte       -> o desconto vale quando o mês SEGUINTE ao aniversário é `mes` (depois de 12 vem 1)
 * Fora disso, devolve o preço sem mudança. Dica: reaproveite {{fn.criar_desconto}}.
 */
export const {{fn.criar_promo}} = (mes, percentual) => {
  throw new Error('Implemente {{fn.criar_promo}}');
};
