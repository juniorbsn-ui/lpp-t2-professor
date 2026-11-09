import copy
import unittest

import _caminho  # noqa: F401
from nucleo import provas, util
import fase5 as m

CTX = util.carregar_contexto()
REGRAS = CTX["regras"]
V, MAXIMO = REGRAS["velocidade"], REGRAS["posicao_maxima"]
ESP = util.esperados_do_aluno(CTX["matricula"]) or {}
INICIAL = {"item": 1, "posicao": 0, "tocando": False, "trocas": 0}


def cmd(tipo, valor=None):
    return {"tipo": tipo, "valor": valor}


class TestFase5(unittest.TestCase):
    def aplicar(self, estado, comando):
        return m.{{fn.aplicar_comando}}(copy.deepcopy(estado), comando)

    def test_iniciar_e_pausar(self):
        self.assertTrue(self.aplicar(INICIAL, cmd("iniciar"))["tocando"])
        self.assertFalse(self.aplicar({**INICIAL, "tocando": True}, cmd("pausar"))["tocando"])

    def test_avancar_e_voltar(self):
        self.assertEqual(self.aplicar(INICIAL, cmd("avancar", 30))["posicao"], min(MAXIMO, 30 * V))
        self.assertEqual(self.aplicar({**INICIAL, "posicao": 20}, cmd("voltar", 5))["posicao"], 15)

    def test_avancar_nunca_passa_da_posicao_maxima(self):
        self.assertEqual(self.aplicar(INICIAL, cmd("avancar", 100000))["posicao"], MAXIMO)

    def test_voltar_nunca_fica_negativo(self):
        self.assertEqual(self.aplicar({**INICIAL, "posicao": 10}, cmd("voltar", 100))["posicao"], 0)

    def test_trocar(self):
        novo = self.aplicar({**INICIAL, "posicao": 50}, cmd("trocar", 7))
        self.assertEqual(novo, {"item": 7, "posicao": 0, "tocando": True, "trocas": 1})

    def test_comando_desconhecido_mantem_o_estado(self):
        self.assertEqual(self.aplicar(INICIAL, cmd("dancar")), INICIAL)

    def test_nao_altera_o_estado_recebido(self):
        estado = copy.deepcopy(INICIAL)
        m.{{fn.aplicar_comando}}(estado, cmd("avancar", 30))
        self.assertEqual(estado, INICIAL, "O estado recebido foi alterado. Devolva um estado NOVO.")

    def test_estado_final(self):
        comandos = [cmd("trocar", 2), cmd("avancar", 40), cmd("voltar", 10), cmd("pausar")]
        final = m.{{fn.estado_final}}(copy.deepcopy(INICIAL), copy.deepcopy(comandos))
        self.assertEqual(final, {"item": 2, "posicao": max(0, min(MAXIMO, 40 * V) - 10), "tocando": False, "trocas": 1})

    def test_estilo_funcional(self):
        problemas = util.problemas_de_estilo_python(util.RAIZ / "src" / "fase5.py")
        self.assertEqual(problemas, [], "Estilo funcional:\n  " + "\n  ".join(problemas))

    def test_prova_real_com_os_seus_dados(self):
        esperado = ESP.get("fase5")
        self.assertIsNotNone(esperado, "Matrícula não consta na turma: avise o professor.")
        self.assertEqual(util.hash_curto(provas.PROVAS["fase5"](m, CTX)), esperado,
                         "O resultado com os SEUS dados e regras ainda não confere.")


if __name__ == "__main__":
    unittest.main()
