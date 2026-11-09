# {{emoji}} {{marca}} — o seu universo

> **Matrícula {{matricula}}.** Este universo foi sorteado a partir da sua matrícula. Os nomes das funções, os dados e os números abaixo são **só seus**: quem tem outra matrícula trabalha com outra empresa, outros dados e outras funções.

## A história

{{historia}}

## O vocabulário da {{marca}}

| Conceito | Na sua empresa | Nos dados (chave) |
|---|---|---|
| Catálogo | **{{itens_r}}** | `itens` |
| Agrupamento | **{{categorias_r}}** | `categoria` |
| Pessoa | **{{usuarios_r}}** | `usuarios` |
| Registro de uso | **{{eventos_r}}** ({{medida_r}}) | `eventos` (campo `medida`) |
| Preço | {{preco_r}}, **em centavos** | `preco` |

Todos os valores são **inteiros** (preços em centavos, medidas em unidades inteiras). Assim não existe problema de arredondamento e o resultado é igual em Python e em Node.

## Os seus dados

Eles ficam em `contexto/dados.json` (não edite: o teste da Fase 0 detecta alterações). Um exemplo de cada coleção:

- {{item_r}}: `{{amostra.itens}}`
- {{usuario_r}}: `{{amostra.usuarios}}`
- {{evento_r}}: `{{amostra.eventos}}`
- comando do player: `{{amostra.player}}`

Além de `itens`, `usuarios` e `eventos`, há `eventos_brutos` (a mesma coleção, mas suja: com registros repetidos e inválidos, usada na Fase 4 e no Chefão) e `player` (uma sequência de comandos, usada na Fase 5).

## As suas regras individuais

Além dos dados, cada aluno recebe **regras de negócio próprias**. Elas **não são passadas por parâmetro**: você precisa embuti-las no seu código (como uma constante ou uma condição), exatamente como uma regra real de uma empresa. Os testes de exemplo e a prova com os seus dados já usam as suas regras.

| Fase | Regra | O seu valor | Significado |
|---|---|---|---|
| 1 | `formato_nome` | **{{regra.formato_nome}}** | `maiusculas`: nomes em MAIÚSCULAS · `minusculas`: nomes em minúsculas |
| 1 | `ordem_preco` | **{{regra.ordem_preco}}** | ordenar {{itens_r}} por preço `crescente` ou `decrescente` (empate: menor id) |
| 1 | `passo_codigo` | **{{regra.passo_codigo}}** | o próximo código de {{evento_r}} é `ultimo + passo_codigo` |
| 2 | `criterio_ranking` | **{{regra.criterio_ranking}}** | `medida`: soma de {{medida_r}} · `frequencia`: quantidade de {{eventos_r}} |
| 2 | `nota_min` | **{{regra.nota_min}}** | só contam notas maiores ou iguais a este valor na média |
| 2 | `mes_inatividade` | **{{regra.mes_inatividade}}** | inativo = sem nenhum registro de {{evento_r}} em mês maior ou igual a este |
| 3 | `arredondamento` | **{{regra.arredondamento}}** | `baixo`: arredonda o desconto para baixo · `cima`: para cima |
| 3 | `restricao` | **{{regra.restricao}}** | `ate`: classificação `<=` limite · `abaixo`: classificação `<` limite |
| 3 | `promo_alvo` | **{{regra.promo_alvo}}** | `mes_do_aniversario`: vale no mês do aniversário · `mes_seguinte`: vale no mês seguinte |
| 4 | `limiar_medida` | **{{regra.limiar_medida}}** | {{eventos_r}} com {{medida_r}} abaixo deste valor são descartados |
| 4 | `criterio_ranking` | **{{regra.criterio_ranking}}** | (a mesma da fase 2, agora no ranking de {{usuarios_r}}) |
| 5 | `velocidade` | **{{regra.velocidade}}** | `avancar` soma `valor * velocidade` à posição |
| 5 | `posicao_maxima` | **{{regra.posicao_maxima}}** | a posição nunca passa deste valor |

> O texto de cada função em `src/` repete a regra que vale para **você**. Por isso o código de um colega (mesmo que seja do mesmo universo) não passa nos seus testes sem ser adaptado, e adaptar exige entender a regra.

## Os seus números da sorte

Cada aluno recebe parâmetros diferentes. Nos testes, eles são lidos automaticamente; você não precisa copiá-los para o código.

| Parâmetro | Valor |
|---|---|
| Top N (fase 2) | {{p.n_top}} |
| {{categoria_r}} em foco (fase 3) | {{p.categoria_foco}} |
| Desconto (fase 3) | {{p.pct}}% |
| Mês da promoção (fase 3) | {{p.mes_promo}} |
| Classificação máxima (fase 3) | {{p.limite_classificacao}} |
| Bônus de {{medida_r}} (fase 1) | {{p.bonus}} |
| Top N da esteira (fase 4 e Chefão) | {{p.n_final}} |
| Mês do relatório (Chefão) | {{p.mes_relatorio}} |
