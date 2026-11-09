"""Gerador determinístico de contexto a partir da matrícula.

Mesma matrícula => mesmos dados, em Python e em Node (verificado por teste de paridade).
"""
import hashlib
import json
import pathlib

M32 = 0xFFFFFFFF
NUCLEO = pathlib.Path(__file__).resolve().parent
VERSAO = "lpp-t2:v1:"


def _imul(a, b):
    return (a * b) & M32


class Rng:
    """mulberry32, escrito de forma idêntica em Python e JavaScript."""

    def __init__(self, seed):
        self.a = seed & M32

    def u32(self):
        self.a = (self.a + 0x6D2B79F5) & M32
        a = self.a
        t = _imul(a ^ (a >> 15), 1 | a)
        t = (((t + _imul(t ^ (t >> 7), 61 | t)) & M32) ^ t) & M32
        return (t ^ (t >> 14)) & M32

    def inteiro(self, lo, hi):
        return lo + self.u32() % (hi - lo + 1)

    def escolher(self, lista):
        return lista[self.inteiro(0, len(lista) - 1)]

    def embaralhar(self, lista):
        r = list(lista)
        for i in range(len(r) - 1, 0, -1):
            j = self.inteiro(0, i)
            r[i], r[j] = r[j], r[i]
        return r


def semente(matricula):
    h = hashlib.sha256((VERSAO + str(matricula)).encode("utf-8")).digest()
    return int.from_bytes(h[:4], "big")


def carregar_universos():
    with open(NUCLEO / "universos.json", encoding="utf-8") as f:
        return json.load(f)


def gerar(matricula):
    matricula = str(matricula).strip()
    if not matricula.isdigit():
        raise ValueError("A matrícula deve conter apenas dígitos.")
    cat = carregar_universos()
    uni = cat["universos"][int(matricula) % len(cat["universos"])]
    pes = cat["pessoas"]
    rng = Rng(semente(matricula))

    params = {
        "n_top": rng.inteiro(3, 6),
        "pct": rng.escolher([10, 15, 20, 25, 30]),
        "mes_promo": rng.inteiro(1, 12),
        "limite_classificacao": rng.escolher([12, 14, 16]),
        "bonus": rng.inteiro(5, 30),
        "n_final": rng.inteiro(4, 8),
        "mes_relatorio": rng.inteiro(1, 12),
        "categoria_foco": rng.escolher(uni["categorias"]),
    }

    combos = [p + " " + s for p in uni["prefixos"] for s in uni["sufixos"]]
    nomes_itens = rng.embaralhar(combos)[:24]
    pmin, pmax = uni["preco_min"] // 10, uni["preco_max"] // 10
    itens = []
    for i, nome in enumerate(nomes_itens):
        itens.append({
            "id": i + 1,
            "nome": nome,
            "categoria": rng.escolher(uni["categorias"]),
            "preco": rng.inteiro(pmin, pmax) * 10,
            "classificacao": rng.escolher([0, 10, 12, 14, 16, 18]),
        })

    usuarios = []
    for i in range(30):
        usuarios.append({
            "id": i + 1,
            "nome": rng.escolher(pes["nomes"]) + " " + rng.escolher(pes["sobrenomes"]),
            "plano": rng.escolher(pes["planos"]),
            "idade": rng.inteiro(12, 70),
            "mes": rng.inteiro(1, 12),
        })

    k = rng.inteiro(4, 7)
    ordem = rng.embaralhar([u["id"] for u in usuarios])
    ativos = ordem[k:]

    eventos = []
    for _ in range(120):
        eventos.append({
            "usuario": rng.escolher(ativos),
            "item": rng.escolher(itens)["id"],
            "medida": rng.inteiro(uni["medida_min"], uni["medida_max"]),
            "nota": rng.escolher([0, 0, 1, 2, 3, 3, 4, 4, 5, 5]),
            "mes": rng.inteiro(1, 12),
        })

    duplicados = []
    for _ in range(8):
        duplicados.append(dict(eventos[rng.inteiro(0, len(eventos) - 1)]))
    invalidos = []
    for _ in range(6):
        invalidos.append({
            "usuario": rng.escolher(ativos),
            "item": rng.escolher(itens)["id"],
            "medida": 0,
            "nota": 0,
            "mes": rng.inteiro(1, 12),
        })
    eventos_brutos = rng.embaralhar(eventos + duplicados + invalidos)

    player = [{"tipo": "trocar", "valor": itens[rng.inteiro(0, len(itens) - 1)]["id"]}]
    tipos = ["iniciar", "pausar", "avancar", "avancar", "voltar", "trocar"]
    for _ in range(39):
        tipo = rng.escolher(tipos)
        if tipo in ("avancar", "voltar"):
            valor = rng.inteiro(5, 120)
        elif tipo == "trocar":
            valor = rng.escolher(itens)["id"]
        else:
            valor = None
        player.append({"tipo": tipo, "valor": valor})

    regras_cat = json.load(open(NUCLEO / "regras.json", encoding="utf-8"))
    regras = {nome: rng.escolher(opcoes) for nome, opcoes in regras_cat.items()}
    pct = regras.pop("limiar_pct")
    regras["limiar_medida"] = uni["medida_min"] + (uni["medida_max"] - uni["medida_min"]) * pct // 100

    return {
        "matricula": matricula,
        "universo": {
            "id": uni["id"], "slug": uni["slug"], "marca": uni["marca"],
            "emoji": uni["emoji"], "historia": uni["historia"], "vocab": uni["vocab"],
            "categorias": uni["categorias"],
        },
        "params": params,
        "regras": regras,
        "itens": itens,
        "usuarios": usuarios,
        "eventos": eventos,
        "eventos_brutos": eventos_brutos,
        "player": player,
        "estado_inicial": {"item": 1, "posicao": 0, "tocando": False, "trocas": 0},
    }
