import unittest

import _caminho  # noqa: F401
from nucleo import util
import fase0

CTX = util.carregar_contexto()


class TestFase0(unittest.TestCase):
    def test_boas_vindas(self):
        self.assertEqual(fase0.boas_vindas("{{marca}}"), "Servidores da {{marca}} no ar!")

    def test_boas_vindas_usa_o_parametro(self):
        self.assertEqual(fase0.boas_vindas("Teste"), "Servidores da Teste no ar!")

    def test_matricula_consta_na_turma(self):
        self.assertIsNotNone(
            util.esperados_do_aluno(CTX["matricula"]),
            "Matrícula não consta na turma. Confira o número em t2.config.json ou avise o professor.",
        )

    def test_contexto_nao_foi_adulterado(self):
        from nucleo.gerador import gerar

        self.assertEqual(util.hash_curto(gerar(CTX["matricula"]), 16), util.hash_curto(CTX, 16),
                         "contexto/dados.json foi alterado. Rode `python iniciar.py --forcar` para regenerar.")


if __name__ == "__main__":
    unittest.main()
