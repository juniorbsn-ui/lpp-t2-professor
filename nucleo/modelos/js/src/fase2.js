// Fase 2 — O painel de dados (map / filter / reduce)
// Regras: SEM for/while, SEM push/splice e SEM alterar os arrays recebidos.
// ATENÇÃO: cada aluno tem REGRAS INDIVIDUAIS (veja contexto/CONTEXTO.md). As suas estão nos textos abaixo.

/**
 * Soma a "medida" ({{medida_r}}) dos {{eventos_r}} por {{categoria_r}} {{do_item}}.
 * Devolve um objeto { categoria: total }. Só aparecem {{categorias_r}} que tiveram ao menos um registro de {{evento_r}}.
 */
export const {{fn.total_por_categoria}} = (eventos, itens) => {
  throw new Error('Implemente {{fn.total_por_categoria}}');
};

/**
 * Devolve o array com os ids dos `n` {{itens_r}} mais populares.
 * Regra individual criterio_ranking = **{{regra.criterio_ranking}}**:
 *   medida     -> popularidade = soma da "medida" dos {{eventos_r}} {{do_item}}
 *   frequencia -> popularidade = QUANTIDADE de {{eventos_r}} {{do_item}} (cada registro vale 1)
 * Ordem: maior popularidade primeiro; em empate, menor id primeiro.
 */
export const {{fn.itens_populares}} = (eventos, n) => {
  throw new Error('Implemente {{fn.itens_populares}}');
};

/**
 * Devolve o array (ordenado, crescente) dos ids de {{usuarios_r}} INATIVOS.
 * Regra individual mes_inatividade = **{{regra.mes_inatividade}}**: é inativo quem NÃO tem nenhum registro de {{evento_r}}
 * em um mês maior ou igual a {{regra.mes_inatividade}}.
 */
export const {{fn.usuarios_inativos}} = (usuarios, eventos) => {
  throw new Error('Implemente {{fn.usuarios_inativos}}');
};

/**
 * Média das notas por {{categoria_r}}.
 * Regra individual nota_min = **{{regra.nota_min}}**: só contam os {{eventos_r}} com nota >= {{regra.nota_min}}.
 * Para evitar decimais, devolva a média x 100 truncada: Math.floor(soma * 100 / quantidade).
 * Ex.: notas 4 e 5 => 450. Devolve um objeto { categoria: media_x100 }.
 */
export const {{fn.nota_media_por_categoria}} = (eventos, itens) => {
  throw new Error('Implemente {{fn.nota_media_por_categoria}}');
};
