export interface IncTipologia {
  id: string;
  nome: string;
  descricao: string;
  areaM2: number;
  quartos: number;
  suites: number;
  vagas: number;
  valorPadrao: number;
  destaque?: boolean;
}

export interface IncEmpreendimento {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  bairro: string;
  previsaoEntrega: string;
  mesesObra: number;
  mesesPosObra: number;
  maxParcelasProSoluto: number;
  limiteProSolutoPercent: number; // 23% da INC
  tipologias: IncTipologia[];
  descricao: string;
}

export const INC_EMPREENDIMENTOS: IncEmpreendimento[] = [
  {
    id: 'park-jardim-do-sol',
    nome: 'Park Jardim do Sol',
    cidade: 'Uberlândia',
    estado: 'MG',
    bairro: 'Novo Mundo',
    previsaoEntrega: 'Dezembro/2028',
    mesesObra: 30,
    mesesPosObra: 44,
    maxParcelasProSoluto: 74,
    limiteProSolutoPercent: 23,
    descricao: 'Empreendimento MCMV em Uberlândia com portaria 24h e estrutura completa.',
    tipologias: [
      {
        id: 'pjs-2q',
        nome: '2 Quartos',
        descricao: 'Apartamento padrão com 2 quartos.',
        areaM2: 41.20,
        quartos: 2,
        suites: 0,
        vagas: 1,
        valorPadrao: 220000,
        destaque: true,
      },
    ],
  },
  {
    id: 'park-espanha',
    nome: 'Park Espanha',
    cidade: 'Uberlândia',
    estado: 'MG',
    bairro: 'Jardim Espanha',
    previsaoEntrega: 'Em Obras',
    mesesObra: 30,
    mesesPosObra: 44,
    maxParcelasProSoluto: 74,
    limiteProSolutoPercent: 23,
    descricao: 'Empreendimento MCMV em Uberlândia no bairro Jardim Espanha.',
    tipologias: [
      {
        id: 'pe-2q',
        nome: '2 Quartos',
        descricao: 'Apartamento padrão com 2 quartos.',
        areaM2: 45.00,
        quartos: 2,
        suites: 0,
        vagas: 1,
        valorPadrao: 220000,
        destaque: true,
      },
    ],
  },
];

export const EMPREENDIMENTO_PADRAO_INC = INC_EMPREENDIMENTOS[0];
