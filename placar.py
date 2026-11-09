#!/usr/bin/env python3
"""Placar do Trabalho 02: roda os testes fase a fase, mostra XP e distintivos e salva progresso.json.

Uso:
    python placar.py          # roda até a primeira fase que falhar
    python placar.py --tudo   # roda todas as fases, mesmo as bloqueadas
    python placar.py --json   # imprime só o resultado em JSON (usado na correção em lote)
"""
import io
import json
import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
for caminho in (RAIZ / "testes", RAIZ / "src", RAIZ):
    sys.path.insert(0, str(caminho))

from nucleo import util  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def mensagem(tb):
    linhas = [l for l in tb.strip().splitlines() if l.strip()]
    if "NotImplementedError" in linhas[-1]:
        return "ainda não implementada"
    inicio = next((i for i, l in enumerate(linhas) if l.startswith("AssertionError")), None)
    if inicio is None:
        return linhas[-1][:200]
    corpo = "\n".join(linhas[inicio:])
    primeira = linhas[inicio].split(":", 1)[1].strip()
    dica = corpo.rsplit(" : ", 1)[1].strip() if " : " in corpo else ""
    return (dica or primeira)[:200]


def rodar_fase(fid):
    for nome in [m for m in sys.modules if m == "test_" + fid or m == fid]:
        sys.modules.pop(nome, None)
    suite = unittest.defaultTestLoader.loadTestsFromName("test_" + fid)
    res = unittest.TextTestRunner(stream=io.StringIO(), verbosity=0).run(suite)
    falhas = [(t.id().split(".")[-1], mensagem(tb)) for t, tb in res.failures + res.errors]
    return {"ok": not falhas, "testes": res.testsRun, "falhas": falhas}


def main(argv):
    tudo, so_json = "--tudo" in argv, "--json" in argv
    cfg = util.carregar_json(RAIZ / "t2.config.json")
    if not (RAIZ / "contexto" / "dados.json").exists():
        sys.exit("Rode primeiro:  python iniciar.py")
    ctx = util.carregar_contexto()
    fases = util.carregar_json(RAIZ / "nucleo" / "modelos" / "fases.json")
    esperado = util.esperados_do_aluno(ctx["matricula"]) or {}

    resultados, liberada = {}, True
    for fase in fases:
        if liberada or tudo:
            resultados[fase["id"]] = rodar_fase(fase["id"])
            liberada = liberada and resultados[fase["id"]]["ok"]

    xp = sum(f["xp"] for f in fases if resultados.get(f["id"], {}).get("ok"))
    total_xp = sum(f["xp"] for f in fases)
    vitoria = util.codigo_vitoria(ctx["matricula"], esperado["chefao"]) if resultados.get("chefao", {}).get("ok") else None
    progresso = {
        "matricula": ctx["matricula"], "linguagem": cfg.get("linguagem"), "universo": ctx["universo"]["marca"],
        "fases": {k: {"ok": v["ok"], "testes": v["testes"], "falhas": len(v["falhas"])} for k, v in resultados.items()},
        "xp": xp, "xp_total": total_xp, "vitoria": vitoria,
        "gerado_em": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    (RAIZ / "progresso.json").write_text(json.dumps(progresso, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    if so_json:
        print(json.dumps(progresso, ensure_ascii=False))
        return

    print("\n%s  %s — Trabalho 02 | matrícula %s\n" % (ctx["universo"]["emoji"], ctx["universo"]["marca"], ctx["matricula"]))
    primeira_falha = None
    for fase in fases:
        r = resultados.get(fase["id"])
        if r is None:
            print("  🔒  %-34s %4d XP" % (fase["titulo"], fase["xp"]))
        elif r["ok"]:
            print("  ✅  %-34s %4d XP  %s" % (fase["titulo"], fase["xp"], fase["distintivo"]))
        else:
            print("  ❌  %-34s %4d XP  (%d de %d testes falharam)" % (fase["titulo"], fase["xp"], len(r["falhas"]), r["testes"]))
            primeira_falha = primeira_falha or (fase, r)
    print("\n  XP: %d / %d" % (xp, total_xp))
    if primeira_falha:
        fase, r = primeira_falha
        print("\n  O que ajustar em \"%s\":" % fase["titulo"])
        for nome, msg in r["falhas"]:
            print("   • %s — %s" % (nome.replace("test_", "").replace("_", " "), msg))
        print("\n  Roteiro: fases/%s.md" % fase["arquivo"])
    elif vitoria:
        print("\n  👑  TRABALHO COMPLETO! Código de vitória: %s" % vitoria)
        print("      Faça o commit, o push e compartilhe o repositório com o professor.")
    print()


if __name__ == "__main__":
    main(sys.argv[1:])
