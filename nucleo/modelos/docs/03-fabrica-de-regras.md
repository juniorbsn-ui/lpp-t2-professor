# {{emoji}} Fase 3 — A fábrica de regras

> **Missão:** criar funções que **fabricam outras funções** para as regras de negócio da {{marca}}.
> **Recompensa:** 15 XP · distintivo 🏭 *Fábrica de funções*

## O que você vai aprender

- Funções são **valores**: podem ser guardadas, passadas e devolvidas.
- O que é uma **closure** (a função "lembra" os valores com que foi criada).
- Parametrizar regras sem copiar e colar código.

## Vamos entender

Pense em uma **forma de biscoito**. A forma (a função fábrica) é configurada uma vez — estrela, coração — e depois produz quantos biscoitos você quiser. Já a função `criar_desconto(20)` devolve uma função "desconto de 20%": você a cria uma vez e usa em todos os preços.

O valor `20` fica "preso" dentro da função devolvida. Isso é uma **closure**.

## Faça como eu fiz

Crie `treino/regras.<!--py-->py<!--/py--><!--js-->js<!--/js-->`:

<!--py-->
```python
def criar_taxa(percentual):
    return lambda preco: preco + preco * percentual // 100

taxa10 = criar_taxa(10)
taxa50 = criar_taxa(50)
print(taxa10(1000), taxa50(1000))   # 1100 1500: cada função lembra o seu percentual
```
<!--/py-->
<!--js-->
```js
const criarTaxa = (percentual) => (preco) => preco + Math.floor((preco * percentual) / 100);

const taxa10 = criarTaxa(10);
const taxa50 = criarTaxa(50);
console.log(taxa10(1000), taxa50(1000)); // 1100 1500: cada função lembra o seu percentual
```
<!--/js-->

## Mão na massa

Abra `src/<!--py-->fase3.py<!--/py--><!--js-->fase3.js<!--/js-->` e implemente as 4 fábricas da **{{marca}}**:

| Função | Devolve uma função que... |
|---|---|
| `{{fn.criar_filtro_categoria}}(categoria)` | diz se {{um_item}} pertence à categoria recebida ({{categoria_r}}) |
| `{{fn.criar_restricao}}(limite)` | diz se a classificação {{do_item}} é no máximo `limite` |
| `{{fn.criar_desconto}}(percentual)` | calcula o preço com desconto (inteiro, em centavos) |
| `{{fn.criar_promo}}(mes, percentual)` | aplica o desconto só se {{o_usuario}} faz aniversário naquele mês |

Os testes usam os **seus** parâmetros (veja `contexto/CONTEXTO.md`): categoria em foco **{{p.categoria_foco}}**, desconto de **{{p.pct}}%**, mês **{{p.mes_promo}}**, classificação limite **{{p.limite_classificacao}}**.

As suas **regras individuais** desta fase: arredondamento do desconto **{{regra.arredondamento}}**, restrição **{{regra.restricao}}** e promoção no **{{regra.promo_alvo}}**. Elas ficam escritas dentro das suas funções. Reaproveite `{{fn.criar_desconto}}` dentro de `{{fn.criar_promo}}`: uma fábrica pode usar outra.

Registre no `JUSTIFICATIVA.md`: o que cada função "lembra" depois de criada.

## Rodar os testes

<!--py-->`python placar.py`<!--/py--><!--js-->`node placar.mjs`<!--/js-->

## Para saber mais

- A técnica de transformar uma função de 2 argumentos em duas funções de 1 argumento se chama **currying**.
- Em Python, também é possível usar `functools.partial` para fixar argumentos.

## O que aprendemos

- Funções de primeira classe podem ser devolvidas por outras funções.
- Closure = função que carrega consigo os valores do contexto em que nasceu.
- Fábricas evitam código repetido e deixam as regras configuráveis.
