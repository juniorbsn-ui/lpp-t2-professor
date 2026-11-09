#!/usr/bin/env python3
"""Prepara o seu Trabalho 02: sorteia o universo pela matrícula e gera dados, roteiros, esqueletos e testes.

Uso:
    python iniciar.py                 # pergunta a matrícula
    python iniciar.py 1234567         # informa a matrícula direto
    python iniciar.py --forcar        # regenera contexto, roteiros e testes (nunca apaga o seu código em src/)
    python iniciar.py --recriar-src   # recria os esqueletos de src/ (CUIDADO: apaga o que você escreveu)
"""
import json
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(RAIZ))

from nucleo import util  # noqa: E402
from nucleo.gerador import gerar  # noqa: E402

LINGUAGEM = "python"
MODELOS = RAIZ / "nucleo" / "modelos"


def escrever(caminho, texto):
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(texto, encoding="utf-8", newline="\n")


def main(argv):
    forcar = "--forcar" in argv
    recriar_src = "--recriar-src" in argv
    args = [a for a in argv if not a.startswith("--")]

    cfg_path = RAIZ / "t2.config.json"
    cfg = json.loads(cfg_path.read_text(encoding="utf-8")) if cfg_path.exists() else {}

    matricula = (args[0] if args else cfg.get("matricula") or "").strip()
    if not matricula:
        matricula = input("Digite a sua matrícula (só números): ").strip()
    if not matricula.isdigit():
        sys.exit("Matrícula inválida: use apenas números.")
    if cfg.get("matricula") and cfg["matricula"] != matricula and not forcar:
        sys.exit("Este repositório já foi iniciado com outra matrícula (%s). Use --forcar se tiver certeza." % cfg["matricula"])
    if cfg.get("linguagem") and cfg["linguagem"] != LINGUAGEM and not forcar:
        sys.exit("Este repositório já foi iniciado em %s. Use --forcar para trocar para %s." % (cfg["linguagem"], LINGUAGEM))

    ctx = gerar(matricula)
    escrever(RAIZ / "contexto" / "dados.json", json.dumps(ctx, ensure_ascii=False, indent=1) + "\n")
    escrever(cfg_path, json.dumps({"matricula": matricula, "linguagem": LINGUAGEM}, indent=2) + "\n")

    # roteiros (fases/*.md) e contexto/CONTEXTO.md
    for modelo in sorted((MODELOS / "docs").glob("*.md")):
        texto = util.renderizar(modelo.read_text(encoding="utf-8"), ctx, LINGUAGEM)
        destino = RAIZ / "contexto" / modelo.name if modelo.name == "CONTEXTO.md" else RAIZ / "fases" / modelo.name
        escrever(destino, texto)

    # testes: sempre regenerados (são do professor)
    for modelo in sorted((MODELOS / "py" / "testes").glob("*.py")):
        escrever(RAIZ / "testes" / modelo.name, util.renderizar(modelo.read_text(encoding="utf-8"), ctx, LINGUAGEM))

    # esqueletos: só cria o que ainda não existe (seu código é sagrado)
    criados = 0
    for modelo in sorted((MODELOS / "py" / "src").glob("*.py")):
        destino = RAIZ / "src" / modelo.name
        if recriar_src or not destino.exists():
            escrever(destino, util.renderizar(modelo.read_text(encoding="utf-8"), ctx, LINGUAGEM))
            criados += 1

    justificativa = RAIZ / "JUSTIFICATIVA.md"
    if not justificativa.exists():
        escrever(justificativa, (MODELOS / "JUSTIFICATIVA.md").read_text(encoding="utf-8"))
    escrever(RAIZ / "treino" / ".gitkeep", "")

    uni = ctx["universo"]
    print("%s  Universo sorteado: %s" % (uni["emoji"], uni["marca"]))
    print("Matrícula %s | esqueletos criados: %d" % (matricula, criados))
    if util.esperados_do_aluno(matricula) is None:
        print("ATENÇÃO: esta matrícula não consta na turma. Confira o número ou avise o professor.")
    print("\nPróximo passo: abra fases/00-ligar-os-servidores.md e contexto/CONTEXTO.md")


if __name__ == "__main__":
    main(sys.argv[1:])
