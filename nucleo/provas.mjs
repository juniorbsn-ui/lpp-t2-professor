// Provas reais (espelho de provas.py).
import { nomeFuncao } from './util.mjs';

const resolver = (m, ctx) => (chave) => m[nomeFuncao(chave, ctx.universo.vocab, 'node')];
const c = (x) => structuredClone(x);

export function provaFase1(m, ctx) {
  const f = resolver(m, ctx);
  return {
    nomes: f('padronizar_nomes')(c(ctx.usuarios)).map((u) => u.nome),
    evento: f('registrar_evento')(c(ctx.eventos[0]), ctx.params.bonus),
    codigo: f('proximo_codigo')(ctx.eventos.length),
    ids: f('ordenar_itens')(c(ctx.itens)).map((i) => i.id),
  };
}

export function provaFase2(m, ctx) {
  const f = resolver(m, ctx);
  const ev = c(ctx.eventos), itens = c(ctx.itens), usu = c(ctx.usuarios);
  return {
    total: f('total_por_categoria')(ev, itens),
    populares: [...f('itens_populares')(ev, ctx.params.n_top)],
    inativos: [...f('usuarios_inativos')(usu, ev)],
    nota: f('nota_media_por_categoria')(ev, itens),
  };
}

export function provaFase3(m, ctx) {
  const f = resolver(m, ctx);
  const p = ctx.params, itens = c(ctx.itens), usu = c(ctx.usuarios);
  const foco = f('criar_filtro_categoria')(p.categoria_foco);
  const liberado = f('criar_restricao')(p.limite_classificacao);
  const desconto = f('criar_desconto')(p.pct);
  const promo = f('criar_promo')(p.mes_promo, p.pct);
  return {
    foco: itens.filter((i) => foco(i)).map((i) => i.id),
    liberados: itens.filter((i) => liberado(i)).map((i) => i.id),
    precos: itens.map((i) => [i.id, desconto(i.preco)]),
    aniversario: usu.map((u) => [u.id, promo(u, 10000)]),
  };
}

export function provaFase4(m, ctx) {
  const f = resolver(m, ctx);
  const esteira = f('montar_esteira')(ctx.params.n_final);
  return esteira(c(ctx.eventos_brutos)).map((par) => [...par]);
}

export function provaFase5(m, ctx) {
  const f = resolver(m, ctx);
  const aplicar = f('aplicar_comando');
  let estado = c(ctx.estado_inicial);
  const trajetoria = [];
  for (const comando of c(ctx.player)) { // a prova pode usar laço; o seu código não
    estado = aplicar(estado, comando);
    trajetoria.push(estado);
  }
  return { final: f('estado_final')(c(ctx.estado_inicial), c(ctx.player)), trajetoria };
}

export function provaChefao(m, ctx) {
  const f = resolver(m, ctx);
  const p = ctx.params;
  const r = f('gerar_relatorio')(c(ctx.eventos_brutos), c(ctx.itens), p.mes_relatorio, p.n_final);
  return {
    mes: r.mes,
    total: r.total,
    categoria_lider: r.categoria_lider == null ? null : [...r.categoria_lider],
    engajados: r.engajados.map((par) => [...par]),
  };
}

export const PROVAS = {
  fase1: provaFase1, fase2: provaFase2, fase3: provaFase3,
  fase4: provaFase4, fase5: provaFase5, chefao: provaChefao,
};
