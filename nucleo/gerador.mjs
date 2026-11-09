// Gerador determinístico de contexto a partir da matrícula (espelho de gerador.py).
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const NUCLEO = dirname(fileURLToPath(import.meta.url));
const VERSAO = 'lpp-t2:v1:';

export class Rng {
  constructor(seed) { this.a = seed | 0; }
  u32() {
    this.a = (this.a + 0x6D2B79F5) | 0;
    const a = this.a;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (t ^ (t >>> 14)) >>> 0;
  }
  inteiro(lo, hi) { return lo + (this.u32() % (hi - lo + 1)); }
  escolher(lista) { return lista[this.inteiro(0, lista.length - 1)]; }
  embaralhar(lista) {
    const r = [...lista];
    for (let i = r.length - 1; i > 0; i--) {
      const j = this.inteiro(0, i);
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }
}

export function semente(matricula) {
  return createHash('sha256').update(VERSAO + String(matricula), 'utf8').digest().readUInt32BE(0);
}

export function carregarUniversos() {
  return JSON.parse(readFileSync(join(NUCLEO, 'universos.json'), 'utf8'));
}

export function gerar(matricula) {
  matricula = String(matricula).trim();
  if (!/^\d+$/.test(matricula)) throw new Error('A matrícula deve conter apenas dígitos.');
  const cat = carregarUniversos();
  const uni = cat.universos[Number(matricula) % cat.universos.length];
  const pes = cat.pessoas;
  const rng = new Rng(semente(matricula));

  const params = {
    n_top: rng.inteiro(3, 6),
    pct: rng.escolher([10, 15, 20, 25, 30]),
    mes_promo: rng.inteiro(1, 12),
    limite_classificacao: rng.escolher([12, 14, 16]),
    bonus: rng.inteiro(5, 30),
    n_final: rng.inteiro(4, 8),
    mes_relatorio: rng.inteiro(1, 12),
    categoria_foco: rng.escolher(uni.categorias),
  };

  const combos = uni.prefixos.flatMap((p) => uni.sufixos.map((s) => p + ' ' + s));
  const nomesItens = rng.embaralhar(combos).slice(0, 24);
  const pmin = Math.floor(uni.preco_min / 10);
  const pmax = Math.floor(uni.preco_max / 10);
  const itens = [];
  nomesItens.forEach((nome, i) => {
    itens.push({
      id: i + 1,
      nome,
      categoria: rng.escolher(uni.categorias),
      preco: rng.inteiro(pmin, pmax) * 10,
      classificacao: rng.escolher([0, 10, 12, 14, 16, 18]),
    });
  });

  const usuarios = [];
  for (let i = 0; i < 30; i++) {
    usuarios.push({
      id: i + 1,
      nome: rng.escolher(pes.nomes) + ' ' + rng.escolher(pes.sobrenomes),
      plano: rng.escolher(pes.planos),
      idade: rng.inteiro(12, 70),
      mes: rng.inteiro(1, 12),
    });
  }

  const k = rng.inteiro(4, 7);
  const ordem = rng.embaralhar(usuarios.map((u) => u.id));
  const ativos = ordem.slice(k);

  const eventos = [];
  for (let i = 0; i < 120; i++) {
    eventos.push({
      usuario: rng.escolher(ativos),
      item: rng.escolher(itens).id,
      medida: rng.inteiro(uni.medida_min, uni.medida_max),
      nota: rng.escolher([0, 0, 1, 2, 3, 3, 4, 4, 5, 5]),
      mes: rng.inteiro(1, 12),
    });
  }

  const duplicados = [];
  for (let i = 0; i < 8; i++) duplicados.push({ ...eventos[rng.inteiro(0, eventos.length - 1)] });
  const invalidos = [];
  for (let i = 0; i < 6; i++) {
    invalidos.push({
      usuario: rng.escolher(ativos),
      item: rng.escolher(itens).id,
      medida: 0,
      nota: 0,
      mes: rng.inteiro(1, 12),
    });
  }
  const eventosBrutos = rng.embaralhar([...eventos, ...duplicados, ...invalidos]);

  const player = [{ tipo: 'trocar', valor: itens[rng.inteiro(0, itens.length - 1)].id }];
  const tipos = ['iniciar', 'pausar', 'avancar', 'avancar', 'voltar', 'trocar'];
  for (let i = 0; i < 39; i++) {
    const tipo = rng.escolher(tipos);
    let valor = null;
    if (tipo === 'avancar' || tipo === 'voltar') valor = rng.inteiro(5, 120);
    else if (tipo === 'trocar') valor = rng.escolher(itens).id;
    player.push({ tipo, valor });
  }

  const regrasCat = JSON.parse(readFileSync(join(NUCLEO, 'regras.json'), 'utf8'));
  const regras = Object.fromEntries(Object.entries(regrasCat).map(([nome, opcoes]) => [nome, rng.escolher(opcoes)]));
  const pct = regras.limiar_pct;
  delete regras.limiar_pct;
  regras.limiar_medida = uni.medida_min + Math.floor(((uni.medida_max - uni.medida_min) * pct) / 100);

  return {
    matricula,
    universo: {
      id: uni.id, slug: uni.slug, marca: uni.marca, emoji: uni.emoji,
      historia: uni.historia, vocab: uni.vocab, categorias: uni.categorias,
    },
    params,
    regras,
    itens,
    usuarios,
    eventos,
    eventos_brutos: eventosBrutos,
    player,
    estado_inicial: { item: 1, posicao: 0, tocando: false, trocas: 0 },
  };
}
