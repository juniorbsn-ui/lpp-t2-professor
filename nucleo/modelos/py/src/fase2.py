# Fase 2 — O painel de dados (map / filter / reduce / comprehensions)
# Regras: SEM for/while, SEM append/sort()/update() e SEM alterar as listas recebidas.
# ATENÇÃO: cada aluno tem REGRAS INDIVIDUAIS (veja contexto/CONTEXTO.md). As suas estão nos textos abaixo.
from functools import reduce  # noqa: F401  (você vai precisar)


def {{fn.total_por_categoria}}(eventos, itens):
    """Soma a "medida" ({{medida_r}}) dos {{eventos_r}} por {{categoria_r}} {{do_item}}.
    Devolve um dict {categoria: total}. Só aparecem {{categorias_r}} que tiveram ao menos um registro de {{evento_r}}."""
    raise NotImplementedError


def {{fn.itens_populares}}(eventos, n):
    """Devolve a lista com os ids dos `n` {{itens_r}} mais populares.
    Regra individual criterio_ranking = **{{regra.criterio_ranking}}**:
      medida     -> popularidade = soma da "medida" dos {{eventos_r}} {{do_item}}
      frequencia -> popularidade = QUANTIDADE de {{eventos_r}} {{do_item}} (cada registro vale 1)
    Ordem: maior popularidade primeiro; em empate, menor id primeiro."""
    raise NotImplementedError


def {{fn.usuarios_inativos}}(usuarios, eventos):
    """Devolve a lista (ordenada, crescente) dos ids de {{usuarios_r}} INATIVOS.
    Regra individual mes_inatividade = **{{regra.mes_inatividade}}**: é inativo quem NÃO tem nenhum registro de {{evento_r}}
    em um mês maior ou igual a {{regra.mes_inatividade}}."""
    raise NotImplementedError


def {{fn.nota_media_por_categoria}}(eventos, itens):
    """Média das notas por {{categoria_r}}.
    Regra individual nota_min = **{{regra.nota_min}}**: só contam os {{eventos_r}} com nota >= {{regra.nota_min}}.
    Para evitar decimais, devolva a média multiplicada por 100 e truncada: soma * 100 // quantidade.
    Ex.: notas 4 e 5 => 450. Devolve um dict {categoria: media_x100}."""
    raise NotImplementedError
