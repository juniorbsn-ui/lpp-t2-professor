// Dados pequenos e FIXOS usados nos testes de exemplo (iguais para todos os alunos).
export const ITENS = [
  { id: 1, nome: 'A', categoria: 'cat1', preco: 1000, classificacao: 0 },
  { id: 2, nome: 'B', categoria: 'cat1', preco: 2000, classificacao: 12 },
  { id: 3, nome: 'C', categoria: 'cat2', preco: 1500, classificacao: 16 },
];

export const USUARIOS = [
  { id: 1, nome: 'Ana Silva', plano: 'basico', idade: 20, mes: 3 },
  { id: 2, nome: 'Bia Lima', plano: 'padrao', idade: 30, mes: 5 },
  { id: 3, nome: 'Caio Reis', plano: 'premium', idade: 15, mes: 2 },
];

export const EVENTOS = [
  { usuario: 1, item: 1, medida: 30, nota: 4, mes: 1 },
  { usuario: 1, item: 2, medida: 20, nota: 5, mes: 5 },
  { usuario: 2, item: 2, medida: 50, nota: 1, mes: 1 },
  { usuario: 2, item: 3, medida: 40, nota: 2, mes: 8 },
];

export const ev = (usuario, item, medida, mes = 1, nota = 3) => ({ usuario, item, medida, nota, mes });
