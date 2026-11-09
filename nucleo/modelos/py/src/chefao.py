# Chefão — O Relatório Mensal
# Junte tudo: use as funções das fases 2 e 4 (importe-as) e monte o relatório com composição.
# Regras: SEM for/while, SEM alterar os dados recebidos.
from fase2 import {{fn.total_por_categoria}}  # noqa: F401
from fase4 import pipe, {{fn.passo_limpar}}, {{fn.passo_deduplicar}}, {{fn.passo_ranquear}}  # noqa: F401


def {{fn.gerar_relatorio}}(eventos_brutos, itens, mes, n):
    """Gera o relatório de UM mês a partir dos {{eventos_r}} brutos (com repetidos e inválidos).
    Passos: limpar -> deduplicar -> manter só os {{eventos_r}} do `mes` (as suas regras individuais da fase 4 valem aqui).
    Devolve um dict com exatamente estas chaves:
      "mes":             o mês pedido
      "total":           soma da "medida" dos {{eventos_r}} do mês
      "categoria_lider": [categoria, total] {{da_categoria}} com maior total de "medida" no mês (empate: ordem alfabética), ou None se não houver {{eventos_r}}
      "engajados":       os `n` {{usuarios_r}} mais engajados no mês: [[id, pontos], ...] (mesma regra do passo_ranquear da fase 4)"""
    raise NotImplementedError
