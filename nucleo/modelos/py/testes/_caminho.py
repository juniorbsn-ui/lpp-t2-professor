"""Ajusta o sys.path para que os testes encontrem `nucleo` e os seus arquivos em `src/`."""
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
for caminho in (RAIZ, RAIZ / "src"):
    if str(caminho) not in sys.path:
        sys.path.insert(0, str(caminho))
