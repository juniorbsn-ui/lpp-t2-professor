import copy
import unittest

import _caminho  # noqa: F401
from nucleo import provas, util
import fase3 as m
from _dados import ITENS, USUARIOS

CTX = util.carregar_contexto()
REGRAS = CTX["regras"]
ESP = util.esperados_do_aluno(CTX["matricula"]) or {}


class TestFase3(unittest.TestCase):
    def test_filtro_por_categoria(self):
        filtro = m.{{fn.criar_filtro_categoria}}("cat1")
        self.assertEqual([filtro(i) for i in ITENS], [True, True, False])

    def test_restricao_de_classificacao(self):
        liberado = m.{{fn.criar_restricao}}(12)  # classificações dos exemplos: 0, 12 e 16
        esperado = {"ate": [True, True, False], "abaixo": [True, False, False]}[REGRAS["restricao"]]
        self.assertEqual([liberado(i) for i in ITENS], esperado)

    def test_desconto(self):
        desconto = m.{{fn.criar_desconto}}(20)
        self.assertEqual(desconto(1000), 800)  # divisão exata: não depende do arredondamento
        self.assertEqual(desconto(1999), {"baixo": 1599, "cima": 1600}[REGRAS["arredondamento"]])

    def test_promocao_de_aniversario(self):
        promo = m.{{fn.criar_promo}}(3, 50)  # meses de aniversário dos exemplos: 3, 5 e 2
        u1, u2, u3 = USUARIOS
        if REGRAS["promo_alvo"] == "mes_do_aniversario":
            esperado = [5000, 10000, 10000]
        else:
            esperado = [10000, 10000, 5000]
        self.assertEqual([promo(u1, 10000), promo(u2, 10000), promo(u3, 10000)], esperado)

    def test_promocao_usa_o_arredondamento(self):
        promo = m.{{fn.criar_promo}}(3, 50)
        alvo = USUARIOS[0] if REGRAS["promo_alvo"] == "mes_do_aniversario" else USUARIOS[2]
        self.assertEqual(promo(alvo, 999), {"baixo": 499, "cima": 500}[REGRAS["arredondamento"]])

    def test_closures_sao_independentes(self):
        d10, d50 = m.{{fn.criar_desconto}}(10), m.{{fn.criar_desconto}}(50)
        self.assertEqual((d10(1000), d50(1000)), (900, 500))

    def test_nao_altera_os_dados(self):
        itens, usuarios = copy.deepcopy(ITENS), copy.deepcopy(USUARIOS)
        m.{{fn.criar_filtro_categoria}}("cat1")(itens[0])
        m.{{fn.criar_promo}}(3, 50)(usuarios[0], 10000)
        self.assertEqual((itens, usuarios), (ITENS, USUARIOS))

    def test_estilo_funcional(self):
        problemas = util.problemas_de_estilo_python(util.RAIZ / "src" / "fase3.py")
        self.assertEqual(problemas, [], "Estilo funcional:\n  " + "\n  ".join(problemas))

    def test_prova_real_com_os_seus_dados(self):
        esperado = ESP.get("fase3")
        self.assertIsNotNone(esperado, "Matrícula não consta na turma: avise o professor.")
        self.assertEqual(util.hash_curto(provas.PROVAS["fase3"](m, CTX)), esperado,
                         "O resultado com os SEUS dados e regras ainda não confere.")


if __name__ == "__main__":
    unittest.main()
