import copy
import unittest

import _caminho  # noqa: F401
from nucleo import provas, util
import chefao as m
from _dados import ITENS, ev

CTX = util.carregar_contexto()
REGRAS = CTX["regras"]
ESP = util.esperados_do_aluno(CTX["matricula"]) or {}
L = REGRAS["limiar_medida"]
BRUTOS = [
    ev(1, 1, L + 10, mes=1), ev(2, 2, L + 20, mes=1), ev(1, 3, L + 50, mes=2),
    ev(1, 1, L + 10, mes=1),  # repetido
    ev(3, 1, 0, mes=1),       # inválido
]


class TestChefao(unittest.TestCase):
    def relatorio(self, mes, n):
        return m.{{fn.gerar_relatorio}}(copy.deepcopy(BRUTOS), copy.deepcopy(ITENS), mes, n)

    def test_relatorio_de_um_mes_com_dados(self):
        r = self.relatorio(1, 1)
        self.assertEqual(r["mes"], 1)
        self.assertEqual(r["total"], 2 * L + 30)
        self.assertEqual(list(r["categoria_lider"]), ["cat1", 2 * L + 30])
        esperado = {"medida": [[2, L + 20]], "frequencia": [[1, 1]]}[REGRAS["criterio_ranking"]]
        self.assertEqual([list(p) for p in r["engajados"]], esperado)

    def test_relatorio_de_um_mes_sem_eventos(self):
        r = self.relatorio(12, 3)
        self.assertEqual((r["total"], r["categoria_lider"], list(r["engajados"])), (0, None, []))

    def test_nao_altera_a_entrada(self):
        brutos = copy.deepcopy(BRUTOS)
        m.{{fn.gerar_relatorio}}(brutos, copy.deepcopy(ITENS), 1, 2)
        self.assertEqual(brutos, BRUTOS)

    def test_estilo_funcional(self):
        problemas = util.problemas_de_estilo_python(util.RAIZ / "src" / "chefao.py")
        self.assertEqual(problemas, [], "Estilo funcional:\n  " + "\n  ".join(problemas))

    def test_prova_real_com_os_seus_dados(self):
        esperado = ESP.get("chefao")
        self.assertIsNotNone(esperado, "Matrícula não consta na turma: avise o professor.")
        self.assertEqual(util.hash_curto(provas.PROVAS["chefao"](m, CTX)), esperado,
                         "O relatório com os SEUS dados e regras ainda não confere.")


if __name__ == "__main__":
    unittest.main()
