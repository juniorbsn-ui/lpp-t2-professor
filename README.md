# 🧩 Trabalho 02 — Programação Funcional

Este é o **Trabalho 02 (Programação Funcional)** da disciplina *Linguagem de Programação e Paradigmas* (UNIDAVI). Você implementa, executa e testa fase por fase, ganha XP (100 no total; a nota do trabalho é proporcional ao XP) e, no fim, gera um relatório com **os seus dados**. O trabalho é **individual**.

## 📦 Como o trabalho funciona

- É **assíncrono**: não há etapa presencial. Você segue a trilha no seu ritmo (implementar → executar → testar → coletar o resultado).
- A **entrega é pelo GitHub**: o seu repositório (criado a partir deste template) compartilhado com o professor. O que vale é o que estiver no `src/` e no histórico de commits.
- A correção roda os **testes oficiais** sobre o seu `src/`, com os seus dados e regras.

## 🎲 Cada aluno tem o seu universo

Ao informar a matrícula, o trabalho sorteia (de forma determinística) para você:

- uma **empresa** (BitFlix, BitBeats, BitBooks, BitGames, BitCast, BitFit, BitCourses ou BitFood), com vocabulário e **nomes de funções próprios**;
- um **conjunto de dados** exclusivo (itens, pessoas, eventos);
- **parâmetros** (Top N, mês, desconto...) e **regras de negócio individuais** que você precisa escrever no próprio código.

Resultado: o código de um colega **não passa nos seus testes** sem ser entendido e adaptado. Dá para (e é bom) conversar sobre ideias, mas cada solução é de cada um.

## 🚀 Como começar (Windows + VS Code)

1. Nesta página, clique no botão verde **Use this template → Create a new repository**. **Não use *Fork*:** o template cria o seu repositório do zero, só seu.
   - *Owner*: a sua conta · *Visibility*: **Private** · nome sugerido: `lpp-t2-<seu-nome>`.
   - Em *Settings → Collaborators → Add people*, convide o professor (`juniorbsn-ui`).
2. Clone o seu repositório e abra a pasta no **VS Code**.
3. Escolha a trilha e inicie (o terminal do VS Code abre na pasta certa):

| Python 3.10+ | Node.js 20+ |
|---|---|
| `python iniciar.py` | `node iniciar.mjs` |
| `python placar.py` | `node placar.mjs` |

*(Linux/Mac: use `python3`.)* Depois abra `fases/00-ligar-os-servidores.md`.

## 🗺️ O mapa

| Fase | Missão | XP |
|---|---|---|
| 0 | Ligar os servidores (ambiente e primeiro teste) | 5 |
| 1 | A caça às funções impuras (pureza e imutabilidade) | 10 |
| 2 | O painel de dados (`map`, `filter`, `reduce`) | 15 |
| 3 | A fábrica de regras (closures, funções de primeira classe) | 15 |
| 4 | A esteira de curadoria (composição, `pipe`) | 15 |
| 5 | O player sem estado (`reduce` sobre eventos) | 15 |
| 👑 | Chefão: o Relatório Mensal | 25 |

As fases destravam em sequência: `placar` roda até a primeira que falhar e mostra o que ajustar.

## 📁 O que tem em cada pasta

| Pasta/arquivo | Para quê |
|---|---|
| `fases/` | os roteiros (no estilo trilha: conceito, "Faça como eu fiz", "Mão na massa") |
| `contexto/` | a história, os dados e as regras do **seu** universo |
| `src/` | **onde você programa** (único lugar que você edita) |
| `treino/` | seus experimentos dos roteiros (não vale nota) |
| `testes/` | testes de exemplo e prova com os seus dados (não edite) |
| `JUSTIFICATIVA.md` | 2 a 3 linhas por fase, com as suas palavras |
| `progresso.json` | gerado pelo placar |

## ✅ Regras do jogo

- **Sem laços** (`for`/`while`) nem mutação nas fases 2 a 5: o teste de estilo confere.
- Funções **puras**: nada de alterar os dados recebidos.
- Faça **um commit por fase** e mantenha o repositório compartilhado com o professor.
- Pode usar IA como apoio, mas você deve conseguir **explicar cada função** (é o que o `JUSTIFICATIVA.md` registra). O professor roda os testes oficiais sobre o seu `src/` na correção.

## 🧰 Comandos úteis

- `iniciar --forcar` regenera contexto, roteiros e testes (nunca apaga o seu `src/`).
- `placar --tudo` roda todas as fases, mesmo as bloqueadas.
