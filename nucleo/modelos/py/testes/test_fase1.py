import copy
import unittest

import _caminho  # noqa: F401
from nucleo import provas, util
import fase1 as m
from _dados import EVENTOS, ITENS, USUARIOS

CTX = util.carregar_contexto()
REGRAS = CTX["regras"]
ESP = util.esperados_do_aluno(CTX["matricula"]) or {}


class TestFase1(unittest.TestCase):
    def test_padronizar_nomes_devolve_lista_nova(self):
        entrada = copy.deepcopy(USUARIOS)
        saida = m.{{fn.padronizar_nomes}}(entrada)
        esperado = {
            "maiusculas": ["ANA SILVA", "BIA LIMA", "CAIO REIS"],
            "minusculas": ["ana silva", "bia lima", "caio reis"],
        }[REGRAS["formato_nome"]]
        self.assertEqual([u["nome"] for u in saida], esperado)
        self.assertEqual(entrada, USUARIOS, "A lista original foi alterada! Função pura não mexe na entrada.")

    def test_registrar_evento_devolve_evento_novo(self):
        original = copy.deepcopy(EVENTOS[0])
        novo = m.{{fn.registrar_evento}}(original, 5)
        self.assertEqual(novo["medida"], 35)
        self.assertEqual(original, EVENTOS[0], "O registro original foi alterado!")

    def test_proximo_codigo_e_deterministico(self):
        esperado = 10 + REGRAS["passo_codigo"]
        self.assertEqual(m.{{fn.proximo_codigo}}(10), esperado)
        self.assertEqual(m.{{fn.proximo_codigo}}(10), esperado, "Mesma entrada deve dar a mesma saída (nada de estado escondido).")

    def test_ordenar_por_preco_sem_alterar_a_original(self):
        entrada = copy.deepcopy(ITENS)
        saida = m.{{fn.ordenar_itens}}(entrada)
        esperado = {"crescente": [1, 3, 2], "decrescente": [2, 3, 1]}[REGRAS["ordem_preco"]]
        self.assertEqual([i["id"] for i in saida], esperado)
        self.assertEqual(entrada, ITENS, "A lista original foi reordenada! Use sorted().")

    def test_prova_real_com_os_seus_dados(self):
        esperado = ESP.get("fase1")
        self.assertIsNotNone(esperado, "Matrícula não consta na turma: avise o professor.")
        self.assertEqual(util.hash_curto(provas.PROVAS["fase1"](m, CTX)), esperado,
                         "O resultado com os SEUS dados e regras ainda não confere.")


if __name__ == "__main__":
    unittest.main()
