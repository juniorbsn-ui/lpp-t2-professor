# {{emoji}} Fase 5 — O player sem estado

> **Missão:** calcular o estado do player da {{marca}} a partir de uma sequência de comandos, **sem alterar nada**.
> **Recompensa:** 15 XP · distintivo ⏯️ *Estado sob controle*

## O que você vai aprender

- Representar o estado como um **valor** que se transforma a cada evento.
- Usar `reduce` para "reproduzir" uma história de eventos.
- Ligar programação funcional e programação orientada a eventos.

## Vamos entender

Seu **extrato bancário** é uma lista de transações. O saldo não precisa ser guardado em lugar nenhum: basta somar todas as transações a partir do saldo inicial. O estado atual é o resultado de **aplicar todos os eventos em ordem**.

`estado_final = reduce(aplicar_evento, eventos, estado_inicial)`

Cada passo recebe um estado e devolve um estado **novo**. Isso torna fácil voltar no tempo, depurar e testar.

## Faça como eu fiz

Crie `treino/saldo.<!--py-->py<!--/py--><!--js-->js<!--/js-->`:

<!--py-->
```python
from functools import reduce

def aplicar(saldo, transacao):
    if transacao["tipo"] == "deposito":
        return saldo + transacao["valor"]
    if transacao["tipo"] == "saque":
        return saldo - transacao["valor"]
    return saldo

extrato = [{"tipo": "deposito", "valor": 100}, {"tipo": "saque", "valor": 30}, {"tipo": "deposito", "valor": 5}]
print(reduce(aplicar, extrato, 0))   # 75
```
<!--/py-->
<!--js-->
```js
const aplicar = (saldo, transacao) => {
  if (transacao.tipo === 'deposito') return saldo + transacao.valor;
  if (transacao.tipo === 'saque') return saldo - transacao.valor;
  return saldo;
};

const extrato = [{ tipo: 'deposito', valor: 100 }, { tipo: 'saque', valor: 30 }, { tipo: 'deposito', valor: 5 }];
console.log(extrato.reduce(aplicar, 0)); // 75
```
<!--/js-->

## Mão na massa

Abra `src/<!--py-->fase5.py<!--/py--><!--js-->fase5.js<!--/js-->`. O estado do player tem 4 campos: `item`, `posicao`, `tocando` e `trocas`.

| Comando | Efeito |
|---|---|
| `iniciar` / `pausar` | `tocando` vira verdadeiro / falso |
| `avancar` | `posicao` aumenta em `valor * {{regra.velocidade}}` (regra `velocidade`), mas nunca passa de **{{regra.posicao_maxima}}** (regra `posicao_maxima`) |
| `voltar` | `posicao` diminui em `valor`, nunca abaixo de 0 |
| `trocar` | novo `item`, `posicao = 0`, `tocando` verdadeiro, `trocas` + 1 |

Implemente `{{fn.aplicar_comando}}` (um comando) e `{{fn.estado_final}}` (todos, com `reduce`). Use a sequência de comandos do `player` nos seus dados; o estado inicial é `{item: 1, posicao: 0, tocando: falso, trocas: 0}`.

Registre no `JUSTIFICATIVA.md`: por que devolver um estado novo facilita desfazer um comando?

## Rodar os testes

<!--py-->`python placar.py`<!--/py--><!--js-->`node placar.mjs`<!--/js-->

## Para saber mais

- Esse padrão é a base de bibliotecas como Redux (reducers) e de *event sourcing*.
- Compare com o que você fez no Trabalho 01 (eventos): lá o estado era alterado; aqui ele é **recalculado**.

## O que aprendemos

- Estado = resultado de aplicar eventos em ordem.
- `reduce` é a ferramenta natural para isso.
- Estado imutável torna o comportamento previsível e testável.
