import copy
import unittest

import _caminho  # noqa: F401
from nucleo import provas, util
import fase2 as m
from _dados import EVENTOS, ITENS, USUARIOS

CTX = util.carregar_contexto()
REGRAS = CTX["regras"]
ESP = util.esperados_do_aluno(CTX["matricula"]) or {}


class TestFase2(unittest.TestCase):
    def test_total_por_categoria(self):
        self.assertEqual(m.{{fn.total_por_categoria}}(copy.deepcopy(EVENTOS), copy.deepcopy(ITENS)), {"cat1": 100, "cat2": 40})

    def test_itens_populares(self):
        esperado = {"medida": [2, 3], "frequencia": [2, 1]}[REGRAS["criterio_ranking"]]
        self.assertEqual(list(m.{{fn.itens_populares}}(copy.deepcopy(EVENTOS), 2)), esperado)

    def test_usuarios_inativos(self):
        esperado = {4: [3], 5: [3], 6: [1, 3], 7: [1, 3], 8: [1, 3], 9: [1, 2, 3]}[REGRAS["mes_inatividade"]]
        self.assertEqual(list(m.{{fn.usuarios_inativos}}(copy.deepcopy(USUARIOS), copy.deepcopy(EVENTOS))), esperado)

    def test_nota_media_por_categoria(self):
        esperado = {1: {"cat1": 333, "cat2": 200}, 2: {"cat1": 450, "cat2": 200}, 3: {"cat1": 450}}[REGRAS["nota_min"]]
        self.assertEqual(m.{{fn.nota_media_por_categoria}}(copy.deepcopy(EVENTOS), copy.deepcopy(ITENS)), esperado)

    def test_funcoes_nao_alteram_as_entradas(self):
        ev, it, us = copy.deepcopy(EVENTOS), copy.deepcopy(ITENS), copy.deepcopy(USUARIOS)
        m.{{fn.total_por_categoria}}(ev, it)
        m.{{fn.itens_populares}}(ev, 2)
        m.{{fn.usuarios_inativos}}(us, ev)
        m.{{fn.nota_media_por_categoria}}(ev, it)
        self.assertEqual((ev, it, us), (EVENTOS, ITENS, USUARIOS), "Alguma função alterou os dados recebidos.")

    def test_estilo_funcional(self):
        problemas = util.problemas_de_estilo_python(util.RAIZ / "src" / "fase2.py")
        self.assertEqual(problemas, [], "Estilo funcional:\n  " + "\n  ".join(problemas))

    def test_prova_real_com_os_seus_dados(self):
        esperado = ESP.get("fase2")
        self.assertIsNotNone(esperado, "Matrícula não consta na turma: avise o professor.")
        self.assertEqual(util.hash_curto(provas.PROVAS["fase2"](m, CTX)), esperado,
                         "O resultado com os SEUS dados e regras ainda não confere.")


if __name__ == "__main__":
    unittest.main()
