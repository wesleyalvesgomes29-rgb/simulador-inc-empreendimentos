export type PerfilType = 
  | 'cotista_com_dep'
  | 'cotista_sem_dep'
  | 'nao_cotista_com_dep'
  | 'nao_cotista_sem_dep';

export type ThemeMode = 'dark' | 'light';

export interface McmvBracket {
  id: string;
  minRenda: number;
  maxRenda: number;
  faixa: 'Faixa 1' | 'Faixa 2' | 'Faixa 3' | 'Classe Média';
  isCotista: boolean;
  temDependente: boolean;
  financiamentoMax: number;
  subsidioMax: number;
  parcelaEstimada: number;
  taxaJurosAnual: number; // % p.a.
  obs?: string;
}

export interface McmvSimulationResult {
  income: number;
  temDependente: boolean;
  isCotista: boolean;
  perfilLabel: string;
  financiamento: number;
  subsidio: number;
  parcela: number;
  taxaJuros: number;
  faixa: string;
  bracketMatched: McmvBracket | null;
  isExactMatch?: boolean;
  enquadramentoNotice?: string;
}

export interface PropertyDetails {
  empreendimentoId?: string;
  nomeImovel: string;
  construtora: string;
  localizacao: string;
  unidade?: string;
  bloco?: string;
  tipologia: string;
  areaM2?: number;
  valorImovel: number;
}

export interface IntermediariaItem {
  id: string;
  numero: number;
  valor: number;
  mesOuPeriodo: string;
}

export interface FinancialFlowConfig {
  valorImovel: number;
  financiamentoCaixa: number;
  subsidioCaixa: number;
  fgts: number;
  saldoEntrada: number;
  sinalAVista: number;
  
  // Obra INC (INCC)
  qtdParcelasObra: number;
  valorParcelaObra: number;
  totalObra?: number;
  correcaoObra: string;
  
  // Pós-Obra INC (IPCA + 1,99% a.a.)
  qtdParcelasPosObra: number;
  valorParcelaPosObra: number;
  totalPosObra?: number;
  correcaoPosObra: string;

  // Intermediárias / Balões INC
  intermediarias?: IntermediariaItem[];
  totalIntermediarias?: number;
  
  // Limite Pró-Soluto 23%
  percentualProSoluto: number;
  dentroLimite23: boolean;
  
  // Documentação & Custos
  incluirDocumentacao?: boolean;
  valorDocumentacao?: number;
  parcelasDocumentacao?: number;
}

export type AppStep = 
  | 'dados_cliente'
  | 'resultado_mcmv'
  | 'escolha_imovel'
  | 'valores_cliente'
  | 'fluxo_construtora'
  | 'resumo_final';

