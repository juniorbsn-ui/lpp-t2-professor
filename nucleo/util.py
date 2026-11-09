"""Utilidades compartilhadas: hash canônico, nomes de funções, templates e checagem de estilo."""
import ast
import hashlib
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
NUCLEO = RAIZ / "nucleo"


def canonico(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def hash_curto(obj, n=12):
    return hashlib.sha256(canonico(obj).encode("utf-8")).hexdigest()[:n]


def chave_aluno(matricula):
    return hashlib.sha256(str(matricula).encode("utf-8")).hexdigest()[:16]


def carregar_json(caminho):
    with open(caminho, encoding="utf-8") as f:
        return json.load(f)


def carregar_contexto():
    return carregar_json(RAIZ / "contexto" / "dados.json")


def esperados_do_aluno(matricula):
    tabela = carregar_json(NUCLEO / "esperados.json")
    return tabela.get("alunos", {}).get(chave_aluno(matricula))


def nome_funcao(chave, vocab, linguagem="python"):
    padrao = carregar_json(NUCLEO / "funcoes.json")[chave]
    nome = padrao.format(**vocab)
    if linguagem == "node":
        partes = nome.split("_")
        nome = partes[0] + "".join(p.capitalize() for p in partes[1:])
    return nome


# ---------- templates ----------

ARTIGOS = {"o": ("o", "a"), "do": ("do", "da"), "da": ("do", "da"), "um": ("um", "uma"), "ao": ("ao", "à")}


def _blocos_linguagem(texto, linguagem):
    if "<!--" not in texto:
        return texto
    marca = "py" if linguagem == "python" else "js"
    outra = "js" if marca == "py" else "py"
    texto = re.sub(r"<!--%s-->.*?<!--/%s-->" % (outra, outra), "", texto, flags=re.S)
    texto = re.sub(r"<!--/?%s-->" % marca, "", texto)
    texto = re.sub(r"\n[ \t]*\n([ \t]*\n)+", "\n\n", texto)  # colapsa linhas em branco deixadas pelos marcadores
    return texto


def renderizar(texto, ctx, linguagem):
    vocab = ctx["universo"]["vocab"]
    uni = ctx["universo"]
    texto = _blocos_linguagem(texto, linguagem)

    def troca(m):
        chave = m.group(1)
        if chave.startswith("fn."):
            return nome_funcao(chave[3:], vocab, linguagem)
        if chave.startswith("p."):
            return str(ctx["params"][chave[2:]])
        if chave.startswith("regra."):
            return str(ctx["regras"][chave[6:]])
        if chave.startswith("amostra."):
            return canonico(ctx[chave[8:]][0])
        art, _, nome = chave.partition("_")
        if art in ARTIGOS and nome in ("item", "usuario", "evento", "categoria"):
            return ARTIGOS[art][0 if vocab["genero_" + nome] == "m" else 1] + " " + vocab[nome + "_r"]
        if chave in vocab:
            return vocab[chave]
        if chave in ("marca", "emoji", "slug", "historia"):
            return str(uni[chave])
        if chave == "matricula":
            return ctx["matricula"]
        raise KeyError("placeholder desconhecido: " + chave)

    return re.sub(r"\{\{([A-Za-z_.0-9]+)\}\}", troca, texto)


# ---------- checagem de estilo funcional (Python) ----------

METODOS_MUTAVEIS = {"append", "extend", "insert", "pop", "remove", "clear", "update", "setdefault", "sort", "reverse", "add", "discard"}


def problemas_de_estilo_python(caminho):
    codigo = pathlib.Path(caminho).read_text(encoding="utf-8")
    arvore = ast.parse(codigo)
    achados = []
    for no in ast.walk(arvore):
        linha = getattr(no, "lineno", "?")
        if isinstance(no, (ast.For, ast.While, ast.AsyncFor)):
            achados.append("linha %s: laço for/while (use map/filter/reduce ou comprehension)" % linha)
        elif isinstance(no, (ast.Global, ast.Nonlocal)):
            achados.append("linha %s: global/nonlocal (estado escondido)" % linha)
        elif isinstance(no, ast.Call) and isinstance(no.func, ast.Attribute) and no.func.attr in METODOS_MUTAVEIS:
            achados.append("linha %s: método mutável .%s()" % (linha, no.func.attr))
        elif isinstance(no, (ast.Assign, ast.AugAssign, ast.AnnAssign)):
            alvos = no.targets if isinstance(no, ast.Assign) else [no.target]
            for alvo in alvos:
                if isinstance(alvo, (ast.Subscript, ast.Attribute)):
                    achados.append("linha %s: atribuição em item/atributo (mutação)" % linha)
    return achados


def codigo_vitoria(matricula, hash_chefao):
    base = "%s:%s" % (matricula, hash_chefao)
    return "T2-" + hashlib.sha256(base.encode("utf-8")).hexdigest()[:8].upper()
