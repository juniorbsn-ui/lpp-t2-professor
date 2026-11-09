import copy
import unittest

import _caminho  # noqa: F401
from nucleo import provas, util
import fase4 as m
from _dados import EVENTOS, ev

CTX = util.carregar_contexto()
REGRAS = CTX["regras"]
ESP = util.esperados_do_aluno(CTX["matricula"]) or {}
L = REGRAS["limiar_medida"]  # a sua regra individual: descarta medida < L
BRUTOS = [
    ev(2, 1, L + 40), ev(2, 2, L + 20),
    ev(1, 1, L + 10, mes=2), ev(1, 1, L + 10, mes=2),  # repetido
    ev(3, 1, 0), ev(3, 2, max(L - 1, 0)),               # inválidos (abaixo do limiar)
]


class TestFase4(unittest.TestCase):
    def test_pipe_respeita_a_ordem(self):
        self.assertEqual(m.pipe(lambda x: x + 1, lambda x: x * 2)(3), 8)  # (3+1)*2, e não 3*2+1

    def test_pipe_sem_funcoes_devolve_o_valor(self):
        self.assertEqual(m.pipe()(42), 42)

    def test_limpar_respeita_o_limiar(self):
        entrada = [ev(1, 1, 0), ev(1, 1, max(L - 1, 0)), ev(1, 1, L), ev(1, 1, L + 5)]
        saida = m.{{fn.passo_limpar}}(copy.deepcopy(entrada))
        self.assertEqual([e["medida"] for e in saida], [L, L + 5])

    def test_deduplicar_mantem_a_primeira_ocorrencia(self):
        a, b, c = ev(1, 1, 10), ev(2, 1, 20), ev(3, 1, 30)
        self.assertEqual(m.{{fn.passo_deduplicar}}(copy.deepcopy([a, b, a, c, b])), [a, b, c])

    def test_ranquear(self):
        esperado = {"medida": [[2, 90], [1, 50]], "frequencia": [[1, 2], [2, 2]]}[REGRAS["criterio_ranking"]]
        self.assertEqual([list(p) for p in m.{{fn.passo_ranquear}}(2)(copy.deepcopy(EVENTOS))], esperado)

    def test_esteira_completa(self):
        entrada = copy.deepcopy(BRUTOS)
        esperado = {"medida": [[2, 2 * L + 60]], "frequencia": [[2, 2]]}[REGRAS["criterio_ranking"]]
        self.assertEqual([list(p) for p in m.{{fn.montar_esteira}}(1)(entrada)], esperado)
        self.assertEqual(entrada, BRUTOS, "A esteira alterou a entrada.")

    def test_estilo_funcional(self):
        problemas = util.problemas_de_estilo_python(util.RAIZ / "src" / "fase4.py")
        self.assertEqual(problemas, [], "Estilo funcional:\n  " + "\n  ".join(problemas))

    def test_prova_real_com_os_seus_dados(self):
        esperado = ESP.get("fase4")
        self.assertIsNotNone(esperado, "Matrícula não consta na turma: avise o professor.")
        self.assertEqual(util.hash_curto(provas.PROVAS["fase4"](m, CTX)), esperado,
                         "O resultado com os SEUS dados e regras ainda não confere.")


if __name__ == "__main__":
    unittest.main()
