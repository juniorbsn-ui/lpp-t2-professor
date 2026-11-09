// Utilidades compartilhadas (espelho de util.py).
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const NUCLEO = dirname(fileURLToPath(import.meta.url));
export const RAIZ = dirname(NUCLEO);

export function canonico(x) {
  if (Array.isArray(x)) return '[' + x.map(canonico).join(',') + ']';
  if (x && typeof x === 'object') {
    return '{' + Object.keys(x).sort().map((k) => JSON.stringify(k) + ':' + canonico(x[k])).join(',') + '}';
  }
  return JSON.stringify(x);
}
export const hashCurto = (obj, n = 12) => createHash('sha256').update(canonico(obj), 'utf8').digest('hex').slice(0, n);
export const chaveAluno = (m) => createHash('sha256').update(String(m), 'utf8').digest('hex').slice(0, 16);
export const carregarJson = (caminho) => JSON.parse(readFileSync(caminho, 'utf8'));
export const carregarContexto = () => carregarJson(join(RAIZ, 'contexto', 'dados.json'));
export const esperadosDoAluno = (m) => carregarJson(join(NUCLEO, 'esperados.json')).alunos?.[chaveAluno(m)];

export function nomeFuncao(chave, vocab, linguagem = 'node') {
  const padrao = carregarJson(join(NUCLEO, 'funcoes.json'))[chave];
  let nome = padrao.replace(/\{(\w+)\}/g, (_, k) => vocab[k]);
  if (linguagem === 'node') {
    const [p, ...resto] = nome.split('_');
    nome = p + resto.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
  }
  return nome;
}

export function blocosLinguagem(texto, linguagem) {
  if (!texto.includes('<!--')) return texto;
  const marca = linguagem === 'python' ? 'py' : 'js';
  const outra = marca === 'py' ? 'js' : 'py';
  return texto
    .replace(new RegExp(`<!--${outra}-->[\\s\\S]*?<!--/${outra}-->`, 'g'), '')
    .replace(new RegExp(`<!--/?${marca}-->`, 'g'), '')
    .replace(/\n[ \t]*\n([ \t]*\n)+/g, '\n\n');
}

const ARTIGOS = { o: ['o', 'a'], do: ['do', 'da'], da: ['do', 'da'], um: ['um', 'uma'], ao: ['ao', 'à'] };

export function renderizar(texto, ctx, linguagem) {
  const vocab = ctx.universo.vocab;
  const uni = ctx.universo;
  texto = blocosLinguagem(texto, linguagem);
  return texto.replace(/\{\{([A-Za-z_.0-9]+)\}\}/g, (_, chave) => {
    if (chave.startsWith('fn.')) return nomeFuncao(chave.slice(3), vocab, linguagem);
    if (chave.startsWith('p.')) return String(ctx.params[chave.slice(2)]);
    if (chave.startsWith('regra.')) return String(ctx.regras[chave.slice(6)]);
    if (chave.startsWith('amostra.')) return canonico(ctx[chave.slice(8)][0]);
    const [art, ...resto] = chave.split('_');
    const nome = resto.join('_');
    if (art in ARTIGOS && ['item', 'usuario', 'evento', 'categoria'].includes(nome)) {
      return ARTIGOS[art][vocab['genero_' + nome] === 'm' ? 0 : 1] + ' ' + vocab[nome + '_r'];
    }
    if (chave in vocab) return vocab[chave];
    if (['marca', 'emoji', 'slug', 'historia'].includes(chave)) return String(uni[chave]);
    if (chave === 'matricula') return ctx.matricula;
    throw new Error('placeholder desconhecido: ' + chave);
  });
}

export function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.values(obj).forEach(deepFreeze);
  }
  return obj;
}

// ---------- checagem de estilo funcional (JavaScript) ----------
function limpar(codigo) {
  return codigo
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/`(?:\\.|[^`\\])*`/g, '``')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''");
}
export function problemasDeEstiloJs(codigoOriginal) {
  const codigo = limpar(codigoOriginal);
  const regras = [
    [/\bfor\s*(await\s*)?\(/, 'laço for (use map/filter/reduce)'],
    [/\bwhile\s*\(/, 'laço while'],
    [/\bdo\s*\{/, 'laço do/while'],
    [/\.(push|pop|shift|unshift|splice|fill|copyWithin)\s*\(/, 'método mutável de array'],
    [/\bdelete\s+[\w$]/, 'delete (mutação)'],
    [/[\w$\]\)]\.[\w$]+\s*(\+|-|\*|\/)?=(?![=>])/, 'atribuição em propriedade (mutação)'],
    [/[\w$]\[[^\]\n]+\]\s*(\+|-|\*|\/)?=(?![=>])/, 'atribuição em índice (mutação)'],
  ];
  return regras.filter(([re]) => re.test(codigo)).map(([, msg]) => msg);
}

export function codigoVitoria(matricula, hashChefao) {
  return 'T2-' + createHash('sha256').update(`${matricula}:${hashChefao}`, 'utf8').digest('hex').slice(0, 8).toUpperCase();
}
