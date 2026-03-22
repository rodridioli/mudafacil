export const PLAN_LIMITS = {
  FREE: {
    mudancas: 1,
    itensPorCanvas: 15,
    cotacoesPorMudanca: 3,
    filtrosAvancados: false,
  },
  TRIAL: {
    mudancas: Infinity,
    itensPorCanvas: Infinity,
    cotacoesPorMudanca: Infinity,
    filtrosAvancados: true,
  },
  PRO: {
    mudancas: Infinity,
    itensPorCanvas: Infinity,
    cotacoesPorMudanca: Infinity,
    filtrosAvancados: true,
  },
} as const;

export const CAMINHOES_CATALOG = [
  {
    id: "fiorino",
    nome: "Fiorino",
    tipo: "fiorino",
    capacidadeM3: 1.7,
    capacidadeKg: 650,
    comprimentoCm: 170,
    larguraCm: 130,
    alturaCm: 110,
    emoji: "🚐",
    cor: "#E2E8F0",
  },
  {
    id: "hr",
    nome: "HR/Sprinter",
    tipo: "hr",
    capacidadeM3: 7.5,
    capacidadeKg: 1500,
    comprimentoCm: 320,
    larguraCm: 195,
    alturaCm: 200,
    emoji: "🚌",
    cor: "#BFDBFE",
  },
  {
    id: "tres-quartos",
    nome: "3/4",
    tipo: "tres-quartos",
    capacidadeM3: 14,
    capacidadeKg: 3000,
    comprimentoCm: 430,
    larguraCm: 220,
    alturaCm: 220,
    emoji: "🚛",
    cor: "#FDE68A",
  },
  {
    id: "bau",
    nome: "Baú",
    tipo: "bau",
    capacidadeM3: 35,
    capacidadeKg: 8000,
    comprimentoCm: 700,
    larguraCm: 240,
    alturaCm: 250,
    emoji: "🏗️",
    cor: "#D1FAE5",
  },
];

export const ITENS_CATALOG = [
  // Quarto
  { nome: "Cama Solteiro", categoria: "quarto", iconeUrl: "🛏️", larguraCm: 88, alturaCm: 190, profundidadeCm: 40, pesoKg: 25, volumeM3: 0.67 },
  { nome: "Cama Casal", categoria: "quarto", iconeUrl: "🛏️", larguraCm: 138, alturaCm: 190, profundidadeCm: 40, pesoKg: 35, volumeM3: 1.05 },
  { nome: "Cama Queen", categoria: "quarto", iconeUrl: "🛏️", larguraCm: 158, alturaCm: 198, profundidadeCm: 40, pesoKg: 40, volumeM3: 1.25 },
  { nome: "Guarda-roupa 2 portas", categoria: "quarto", iconeUrl: "🗄️", larguraCm: 90, alturaCm: 190, profundidadeCm: 50, pesoKg: 60, volumeM3: 0.86 },
  { nome: "Guarda-roupa 4 portas", categoria: "quarto", iconeUrl: "🗄️", larguraCm: 180, alturaCm: 190, profundidadeCm: 50, pesoKg: 90, volumeM3: 1.71 },
  { nome: "Cômoda", categoria: "quarto", iconeUrl: "🪑", larguraCm: 90, alturaCm: 80, profundidadeCm: 40, pesoKg: 35, volumeM3: 0.29 },
  { nome: "Criado-mudo", categoria: "quarto", iconeUrl: "🪑", larguraCm: 45, alturaCm: 55, profundidadeCm: 40, pesoKg: 12, volumeM3: 0.10 },
  // Sala
  { nome: "Sofá 2 lugares", categoria: "sala", iconeUrl: "🛋️", larguraCm: 160, alturaCm: 85, profundidadeCm: 80, pesoKg: 45, volumeM3: 1.09 },
  { nome: "Sofá 3 lugares", categoria: "sala", iconeUrl: "🛋️", larguraCm: 220, alturaCm: 85, profundidadeCm: 80, pesoKg: 65, volumeM3: 1.50 },
  { nome: "TV 50\"", categoria: "sala", iconeUrl: "📺", larguraCm: 112, alturaCm: 70, profundidadeCm: 15, pesoKg: 15, volumeM3: 0.12 },
  { nome: "Rack TV", categoria: "sala", iconeUrl: "🪵", larguraCm: 150, alturaCm: 50, profundidadeCm: 40, pesoKg: 25, volumeM3: 0.30 },
  { nome: "Mesa de Centro", categoria: "sala", iconeUrl: "🪵", larguraCm: 100, alturaCm: 45, profundidadeCm: 60, pesoKg: 20, volumeM3: 0.27 },
  // Cozinha
  { nome: "Geladeira", categoria: "cozinha", iconeUrl: "🧊", larguraCm: 70, alturaCm: 175, profundidadeCm: 70, pesoKg: 70, volumeM3: 0.86 },
  { nome: "Fogão", categoria: "cozinha", iconeUrl: "🍳", larguraCm: 76, alturaCm: 85, profundidadeCm: 60, pesoKg: 35, volumeM3: 0.39 },
  { nome: "Micro-ondas", categoria: "cozinha", iconeUrl: "📦", larguraCm: 49, alturaCm: 30, profundidadeCm: 38, pesoKg: 12, volumeM3: 0.056 },
  { nome: "Mesa de Jantar 4 lugares", categoria: "cozinha", iconeUrl: "🪑", larguraCm: 120, alturaCm: 75, profundidadeCm: 80, pesoKg: 30, volumeM3: 0.72 },
  // Escritório
  { nome: "Mesa de Escritório", categoria: "escritorio", iconeUrl: "🖥️", larguraCm: 150, alturaCm: 75, profundidadeCm: 60, pesoKg: 30, volumeM3: 0.68 },
  { nome: "Cadeira de Escritório", categoria: "escritorio", iconeUrl: "🪑", larguraCm: 60, alturaCm: 120, profundidadeCm: 60, pesoKg: 15, volumeM3: 0.43 },
  { nome: "Estante", categoria: "escritorio", iconeUrl: "📚", larguraCm: 80, alturaCm: 180, profundidadeCm: 30, pesoKg: 40, volumeM3: 0.43 },
  // Caixas
  { nome: "Caixa P", categoria: "caixas", iconeUrl: "📦", larguraCm: 30, alturaCm: 30, profundidadeCm: 30, pesoKg: 10, volumeM3: 0.027 },
  { nome: "Caixa M", categoria: "caixas", iconeUrl: "📦", larguraCm: 40, alturaCm: 40, profundidadeCm: 40, pesoKg: 15, volumeM3: 0.064 },
  { nome: "Caixa G", categoria: "caixas", iconeUrl: "📦", larguraCm: 50, alturaCm: 50, profundidadeCm: 50, pesoKg: 20, volumeM3: 0.125 },
];
