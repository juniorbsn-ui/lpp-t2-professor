# Fase 4 — A esteira de curadoria (composição de funções)
# Regras: SEM for/while, SEM alterar os dados recebidos.
# ATENÇÃO: cada aluno tem REGRAS INDIVIDUAIS (veja contexto/CONTEXTO.md). As suas estão nos textos abaixo.
from functools import reduce  # noqa: F401


def pipe(*funcoes):
    """Devolve uma função que passa o valor pela 1ª função, o resultado pela 2ª, e assim por diante.
    pipe(f, g, h)(x) == h(g(f(x)))"""
    raise NotImplementedError


def {{fn.passo_limpar}}(eventos):
    """Remove os {{eventos_r}} inválidos.
    Regra individual limiar_medida = **{{regra.limiar_medida}}**: descarte quem tem "medida" menor que {{regra.limiar_medida}}."""
    raise NotImplementedError


def {{fn.passo_deduplicar}}(eventos):
    """Remove {{eventos_r}} repetidos (dicts totalmente iguais), mantendo a PRIMEIRA ocorrência e a ordem original."""
    raise NotImplementedError


def {{fn.passo_ranquear}}(n):
    """Devolve uma função f(eventos) -> lista dos `n` {{usuarios_r}} mais engajados, no formato [[id_usuario, pontos], ...].
    Regra individual criterio_ranking = **{{regra.criterio_ranking}}**:
      medida     -> pontos = soma da "medida"
      frequencia -> pontos = QUANTIDADE de {{eventos_r}} (cada registro vale 1)
    Ordem: mais pontos primeiro; empate: menor id primeiro."""
    raise NotImplementedError


def {{fn.montar_esteira}}(n):
    """Devolve a esteira completa: limpar -> deduplicar -> ranquear(n), montada com pipe."""
    raise NotImplementedError
