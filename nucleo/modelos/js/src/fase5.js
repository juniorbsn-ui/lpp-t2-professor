// Fase 5 — O player sem estado (reduce de eventos)
// Regras: SEM for/while, SEM alterar o estado recebido (sempre devolva um estado NOVO).
// ATENÇÃO: cada aluno tem REGRAS INDIVIDUAIS (veja contexto/CONTEXTO.md). As suas estão nos textos abaixo.

/**
 * Aplica UM comando do player e devolve o NOVO estado. O estado tem: item, posicao, tocando, trocas.
 * comando = { tipo, valor }
 *   iniciar -> tocando = true            pausar -> tocando = false
 *   avancar -> posicao + valor * {{regra.velocidade}}   (regra velocidade), mas NUNCA acima de {{regra.posicao_maxima}} (regra posicao_maxima)
 *   voltar  -> posicao - valor (nunca abaixo de 0)
 *   trocar  -> item = valor, posicao = 0, tocando = true, trocas + 1
 * Comando desconhecido: devolve o estado como está.
 */
export const {{fn.aplicar_comando}} = (estado, comando) => {
  throw new Error('Implemente {{fn.aplicar_comando}}');
};

/** Aplica todos os comandos, em ordem, a partir do estado inicial. Use reduce. */
export const {{fn.estado_final}} = (estadoInicial, comandos) => {
  throw new Error('Implemente {{fn.estado_final}}');
};
