"""Provas reais: executam as funções do aluno sobre os dados DELE e devolvem um resultado canônico.

O hash desse resultado é comparado com o esperado para a matrícula (nucleo/esperados.json).
"""
import copy

from nucleo.util import nome_funcao


def _resolver(m, ctx):
    vocab = ctx["universo"]["vocab"]
    return lambda chave: getattr(m, nome_funcao(chave, vocab, "python"))


def prova_fase1(m, ctx):
    f, c = _resolver(m, ctx), copy.deepcopy
    return {
        "nomes": [u["nome"] for u in f("padronizar_nomes")(c(ctx["usuarios"]))],
        "evento": f("registrar_evento")(c(ctx["eventos"][0]), ctx["params"]["bonus"]),
        "codigo": f("proximo_codigo")(len(ctx["eventos"])),
        "ids": [i["id"] for i in f("ordenar_itens")(c(ctx["itens"]))],
    }


def prova_fase2(m, ctx):
    f, c = _resolver(m, ctx), copy.deepcopy
    ev, itens, usu = c(ctx["eventos"]), c(ctx["itens"]), c(ctx["usuarios"])
    return {
        "total": f("total_por_categoria")(ev, itens),
        "populares": list(f("itens_populares")(ev, ctx["params"]["n_top"])),
        "inativos": list(f("usuarios_inativos")(usu, ev)),
        "nota": f("nota_media_por_categoria")(ev, itens),
    }


def prova_fase3(m, ctx):
    f, c = _resolver(m, ctx), copy.deepcopy
    p, itens, usu = ctx["params"], c(ctx["itens"]), c(ctx["usuarios"])
    foco = f("criar_filtro_categoria")(p["categoria_foco"])
    liberado = f("criar_restricao")(p["limite_classificacao"])
    desconto = f("criar_desconto")(p["pct"])
    promo = f("criar_promo")(p["mes_promo"], p["pct"])
    return {
        "foco": [i["id"] for i in itens if foco(i)],
        "liberados": [i["id"] for i in itens if liberado(i)],
        "precos": [[i["id"], desconto(i["preco"])] for i in itens],
        "aniversario": [[u["id"], promo(u, 10000)] for u in usu],
    }


def prova_fase4(m, ctx):
    f, c = _resolver(m, ctx), copy.deepcopy
    esteira = f("montar_esteira")(ctx["params"]["n_final"])
    return [list(par) for par in esteira(c(ctx["eventos_brutos"]))]


def prova_fase5(m, ctx):
    f, c = _resolver(m, ctx), copy.deepcopy
    aplicar = f("aplicar_comando")
    estado, trajetoria = c(ctx["estado_inicial"]), []
    for comando in c(ctx["player"]):  # a prova pode usar laço; o seu código não
        estado = aplicar(estado, comando)
        trajetoria.append(estado)
    return {"final": f("estado_final")(c(ctx["estado_inicial"]), c(ctx["player"])), "trajetoria": trajetoria}


def prova_chefao(m, ctx):
    f, c = _resolver(m, ctx), copy.deepcopy
    p = ctx["params"]
    r = f("gerar_relatorio")(c(ctx["eventos_brutos"]), c(ctx["itens"]), p["mes_relatorio"], p["n_final"])
    return {
        "mes": r["mes"],
        "total": r["total"],
        "categoria_lider": None if r["categoria_lider"] is None else list(r["categoria_lider"]),
        "engajados": [list(par) for par in r["engajados"]],
    }


PROVAS = {
    "fase1": prova_fase1, "fase2": prova_fase2, "fase3": prova_fase3,
    "fase4": prova_fase4, "fase5": prova_fase5, "chefao": prova_chefao,
}
