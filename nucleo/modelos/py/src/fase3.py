# Fase 3 — A fábrica de regras (closures e funções que devolvem funções)
# Regras: SEM for/while, SEM alterar os dados recebidos.
# ATENÇÃO: cada aluno tem REGRAS INDIVIDUAIS (veja contexto/CONTEXTO.md). As suas estão nos textos abaixo.


def {{fn.criar_filtro_categoria}}(categoria):
    """Devolve uma função f(item) -> bool, que é True quando {{o_item}} pertence à categoria recebida ({{categoria_r}})."""
    raise NotImplementedError


def {{fn.criar_restricao}}(limite):
    """Devolve uma função f(item) -> bool sobre a "classificacao" {{do_item}}.
    Regra individual restricao = **{{regra.restricao}}**:
      ate    -> True quando classificacao <= limite
      abaixo -> True quando classificacao <  limite"""
    raise NotImplementedError


def {{fn.criar_desconto}}(percentual):
    """Devolve uma função f(preco) -> preco_com_desconto (inteiro, em centavos).
    Valor exato = preco * (100 - percentual) / 100.
    Regra individual arredondamento = **{{regra.arredondamento}}**: baixo = arredonda para baixo; cima = arredonda para cima."""
    raise NotImplementedError


def {{fn.criar_promo}}(mes, percentual):
    """Devolve uma função f(usuario, preco) -> preco_final.
    Regra individual promo_alvo = **{{regra.promo_alvo}}**:
      mes_do_aniversario -> o desconto vale quando o "mes" {{do_usuario}} é igual a `mes`
      mes_seguinte       -> o desconto vale quando o mês SEGUINTE ao aniversário é `mes` (depois de 12 vem 1)
    Fora disso, devolve o preço sem mudança. Dica: reaproveite {{fn.criar_desconto}}."""
    raise NotImplementedError
