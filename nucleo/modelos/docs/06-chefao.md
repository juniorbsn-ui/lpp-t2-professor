# {{emoji}} Chefão — O Relatório Mensal

> **Missão:** gerar o relatório do mês da {{marca}} combinando tudo o que você construiu.
> **Recompensa:** 25 XP · distintivo 👑 *Código de vitória*

## Vamos entender

O relatório mensal é uma **esteira** que reaproveita as suas peças: a limpeza e a deduplicação (fase 4), o total por {{categoria_r}} (fase 2) e o ranking de {{usuarios_r}} (fase 4). Nada novo para aprender; o desafio é **combinar** funções pequenas e puras em uma maior.

## Mão na massa

Abra `src/<!--py-->chefao.py<!--/py--><!--js-->chefao.js<!--/js-->` e implemente `{{fn.gerar_relatorio}}(eventos_brutos, itens, mes, n)`.

Ela devolve, para o `mes` pedido (no seu caso **{{p.mes_relatorio}}**), um objeto com **exatamente** estas chaves:

| Chave | Conteúdo |
|---|---|
| `mes` | o mês pedido |
| `total` | soma de {{medida_r}} dos {{eventos_r}} do mês (já limpos e sem repetidos) |
| `categoria_lider` | `[categoria, total]` {{da_categoria}} líder (empate: ordem alfabética), ou nulo se não houver {{eventos_r}} |
| `engajados` | os `n` {{usuarios_r}} mais engajados no mês, `[[id, pontos], ...]` (mesma regra `criterio_ranking` da fase 4) |

Passos: **limpar → deduplicar → filtrar o mês → calcular**. Reutilize as funções das fases 2 e 4 (importe-as): as suas regras individuais dessas fases já estão nelas.

## Código de vitória

Ao passar em todos os testes, o placar mostra o seu **código de vitória** (`T2-XXXXXXXX`). Ele é único para a sua matrícula e é gerado a partir do seu relatório; o professor o confere na correção.

## Checklist de entrega

- [ ] `<!--py-->python placar.py<!--/py--><!--js-->node placar.mjs<!--/js-->` mostra todas as fases ✅
- [ ] `JUSTIFICATIVA.md` preenchido (2 a 3 linhas por fase)
- [ ] Um commit por fase, com mensagens claras
- [ ] Repositório compartilhado com o professor

## O que aprendemos

- Funções puras pequenas se combinam em soluções grandes.
- Testar com dados reais e individuais comprova o resultado sem precisar de apresentação.
- Programação funcional descreve **fluxos de dados**: limpar, transformar, agregar.
