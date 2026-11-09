# {{emoji}} Fase 2 — O painel de dados

> **Missão:** montar o painel da {{marca}} usando `map`, `filter`, `reduce` e comprehensions, **sem nenhum laço**.
> **Recompensa:** 15 XP · distintivo 📊 *Mestre dos dados*

## O que você vai aprender

- `filter` (peneira), `map` (transformação) e `reduce` (agregação).
- Substituir o laço `for` por expressões que descrevem **o que** você quer, não **como** fazer.

## Vamos entender

Imagine a **esteira de uma cozinha**:

- **filter** é a peneira: só passa o que interessa (pedidos acima de R$ 20).
- **map** é o tempero: transforma cada item (aplica a taxa em cada preço).
- **reduce** é a panela final: junta tudo em um único resultado (o total).

Em vez de mandar o computador repetir passos com `for` e uma variável que vai mudando, você descreve cada etapa e deixa os dados passarem por elas.

## Faça como eu fiz

Crie `treino/painel.<!--py-->py<!--/py--><!--js-->js<!--/js-->`:

<!--py-->
```python
from functools import reduce

precos = [1200, 800, 2500, 1900]

caros = [p for p in precos if p > 1500]                 # filter (comprehension)
com_taxa = [p + 100 for p in precos]                    # map (comprehension)
total = reduce(lambda acc, p: acc + p, precos, 0)       # reduce: acc é o "acumulador"

# Contar por categoria SEM alterar nada: cada passo devolve um dict novo
pedidos = ["pizza", "sushi", "pizza"]
contagem = reduce(lambda acc, p: {**acc, p: acc.get(p, 0) + 1}, pedidos, {})
print(caros, com_taxa, total, contagem)
```
<!--/py-->
<!--js-->
```js
const precos = [1200, 800, 2500, 1900];

const caros = precos.filter((p) => p > 1500);          // filter
const comTaxa = precos.map((p) => p + 100);            // map
const total = precos.reduce((acc, p) => acc + p, 0);   // reduce: acc é o "acumulador"

// Contar por categoria SEM alterar nada: cada passo devolve um objeto novo
const pedidos = ['pizza', 'sushi', 'pizza'];
const contagem = pedidos.reduce((acc, p) => ({ ...acc, [p]: (acc[p] ?? 0) + 1 }), {});
console.log(caros, comTaxa, total, contagem);
```
<!--/js-->

## Mão na massa

Abra `src/<!--py-->fase2.py<!--/py--><!--js-->fase2.js<!--/js-->` e implemente as 4 consultas do painel da **{{marca}}**:

| Função | Pergunta que responde |
|---|---|
| `{{fn.total_por_categoria}}` | quanto de {{medida_r}} cada {{categoria_r}} acumulou? |
| `{{fn.itens_populares}}` | quais são os {{p.n_top}} {{itens_r}} mais populares, pelo critério **{{regra.criterio_ranking}}**? |
| `{{fn.usuarios_inativos}}` | quais {{usuarios_r}} não têm nenhum registro de {{evento_r}} a partir do mês **{{regra.mes_inatividade}}**? |
| `{{fn.nota_media_por_categoria}}` | qual a nota média (x100) de cada {{categoria_r}}, contando só notas >= **{{regra.nota_min}}**? |

Os valores em negrito são as **suas regras individuais** (veja `contexto/CONTEXTO.md`); elas devem estar escritas no seu código.

**Regras do jogo:** sem `for`/`while`; sem
<!--py-->`append`, `sort()`, `update()` nem atribuição em itens<!--/py--><!--js-->`push`, `splice` nem atribuição em propriedades<!--/js-->. Os testes verificam o estilo do seu código e também se você alterou os dados recebidos.

Dica de desempate no ranking: `maior total primeiro; empate: menor id`. Registre no `JUSTIFICATIVA.md` qual função usou `reduce`, qual usou `filter`/comprehension e por quê.

## Rodar os testes

<!--py-->`python placar.py`<!--/py--><!--js-->`node placar.mjs`<!--/js-->

## Para saber mais

- `reduce` é a operação mais geral: `map` e `filter` podem ser escritos com ele.
- Um bom hábito: escreva primeiro o resultado esperado de um exemplo pequeno (os testes já trazem um).

## O que aprendemos

- `filter` seleciona, `map` transforma, `reduce` agrega.
- Cada etapa devolve um valor novo; nada é alterado.
- Descrever **o quê** deixa o código mais curto e mais fácil de testar.
