import { PropertyDetails, IntermediariaItem } from '../types';

export interface ClientLead {
  id: string;
  dataCriacao: string; // ISO date string
  dataAtualizacao: string;
  nome: string;
  whatsapp: string;
  email?: string;
  cpf?: string;
  renda: number;
  temDependente: boolean;
  isCotista: boolean;
  
  // Property & Simulation details
  imovelInfo: PropertyDetails;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidioCaixa: number;
  fgts: number;
  sinalAVista: number;
  valorEntradaTotal: number;
  percentualProSoluto: number;
  
  // Installments summary
  qtdParcelasObra: number;
  valorParcelaObra: number;
  qtdParcelasPosObra: number;
  valorParcelaPosObra: number;
  intermediarias?: IntermediariaItem[];
  
  status: 'Em Atendimento' | 'Proposta Gerada' | 'Enviado WhatsApp' | 'Negociação';
}

const STORAGE_KEY = 'inc_simulador_leads_v1';

export function getSavedClients(): ClientLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler atendimentos INC do localStorage:', err);
    return [];
  }
}

export function saveClientLead(leadData: Omit<ClientLead, 'id' | 'dataCriacao' | 'dataAtualizacao'> & { id?: string }): ClientLead {
  const clients = getSavedClients();
  const now = new Date().toISOString();

  if (leadData.id) {
    // Update existing
    const index = clients.findIndex(c => c.id === leadData.id);
    if (index >= 0) {
      const updated: ClientLead = {
        ...clients[index],
        ...leadData,
        id: leadData.id,
        dataAtualizacao: now,
      };
      clients[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
      return updated;
    }
  }

  // Create new
  const newLead: ClientLead = {
    ...leadData,
    id: leadData.id || `inc_lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    dataCriacao: now,
    dataAtualizacao: now,
  };

  clients.unshift(newLead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  return newLead;
}

export function deleteClientLead(id: string): void {
  const clients = getSavedClients().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function generateCrmText(lead: ClientLead): string {
  const dataFmt = new Date(lead.dataCriacao).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatBRLVal = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  let text = `=== FICHA DE ATENDIMENTO • INC EMPREENDIMENTOS ===\n`;
  text += `Data: ${dataFmt}\n`;
  text += `Status: ${lead.status}\n\n`;
  
  text += `--- DADOS DO CLIENTE ---\n`;
  text += `Nome: ${lead.nome || 'Não informado'}\n`;
  text += `WhatsApp: ${lead.whatsapp || 'Não informado'}\n`;
  if (lead.email) text += `E-mail: ${lead.email}\n`;
  if (lead.cpf) text += `CPF: ${lead.cpf}\n`;
  text += `Renda Familiar: ${formatBRLVal(lead.renda)}\n`;
  text += `Possui Dependente: ${lead.temDependente ? 'Sim' : 'Não'}\n`;
  text += `Cotista FGTS (>3 anos): ${lead.isCotista ? 'Sim' : 'Não'}\n\n`;

  text += `--- EMPREENDIMENTO & SIMULAÇÃO MCMV ---\n`;
  text += `Empreendimento: ${lead.imovelInfo.nomeImovel} - INC Empreendimentos\n`;
  text += `Tipologia: ${lead.imovelInfo.tipologia}\n`;
  if (lead.imovelInfo.unidade) {
    text += `Unidade: ${lead.imovelInfo.unidade}\n`;
  }
  text += `Valor do Imóvel: ${formatBRLVal(lead.valorImovel)}\n`;
  text += `Financiamento CAIXA: ${formatBRLVal(lead.financiamentoCaixa)}\n`;
  text += `Subsídio MCMV: ${formatBRLVal(lead.subsidioCaixa)}\n`;
  text += `FGTS Utilizado: ${formatBRLVal(lead.fgts)}\n`;
  text += `Total Entrada / Pró-Soluto: ${formatBRLVal(lead.valorEntradaTotal)} (${lead.percentualProSoluto.toFixed(1)}%)\n`;
  
  if (lead.sinalAVista > 0) {
    text += `Sinal / Ato: ${formatBRLVal(lead.sinalAVista)}\n`;
  }
  if (lead.qtdParcelasObra > 0 && lead.valorParcelaObra > 0) {
    text += `Parcelamento Obra: ${lead.qtdParcelasObra}x de ${formatBRLVal(lead.valorParcelaObra)} (INCC)\n`;
  }
  if (lead.qtdParcelasPosObra > 0 && lead.valorParcelaPosObra > 0) {
    text += `Parcelamento Pós-Obra: ${lead.qtdParcelasPosObra}x de ${formatBRLVal(lead.valorParcelaPosObra)} (IPCA + 1,99% a.a.)\n`;
  }
  if (lead.intermediarias && lead.intermediarias.length > 0) {
    const totalInterm = lead.intermediarias.reduce((sum, item) => sum + (item.valor || 0), 0);
    text += `Intermediárias (${lead.intermediarias.length}x): Total ${formatBRLVal(totalInterm)}\n`;
    lead.intermediarias.forEach((item, idx) => {
      text += `  • ${idx + 1}ª Intermediária: ${formatBRLVal(item.valor)} (${item.mesOuPeriodo || 'Período não informado'})\n`;
    });
  }

  return text;
}

export function exportClientsToCsv(clients: ClientLead[]): void {
  if (!clients.length) return;

  const headers = [
    'Data Atendimento',
    'Nome',
    'WhatsApp',
    'E-mail',
    'CPF',
    'Renda',
    'Dependente',
    'Cotista',
    'Empreendimento',
    'Tipologia',
    'Unidade',
    'Valor Imóvel',
    'Financiamento CAIXA',
    'Subsídio MCMV',
    'FGTS',
    'Total Entrada',
    'Pró-Soluto (%)',
    'Sinal à Vista',
    'Status'
  ];

  const rows = clients.map(c => [
    new Date(c.dataCriacao).toLocaleDateString('pt-BR'),
    `"${(c.nome || '').replace(/"/g, '""')}"`,
    `"${(c.whatsapp || '').replace(/"/g, '""')}"`,
    `"${(c.email || '').replace(/"/g, '""')}"`,
    `"${(c.cpf || '').replace(/"/g, '""')}"`,
    c.renda,
    c.temDependente ? 'Sim' : 'Nao',
    c.isCotista ? 'Sim' : 'Nao',
    `"${(c.imovelInfo?.nomeImovel || 'Park Jardim do Sol').replace(/"/g, '""')}"`,
    `"${(c.imovelInfo?.tipologia || '2 Quartos').replace(/"/g, '""')}"`,
    `"${(c.imovelInfo?.unidade || '').replace(/"/g, '""')}"`,
    c.valorImovel,
    c.financiamentoCaixa,
    c.subsidioCaixa,
    c.fgts,
    c.valorEntradaTotal,
    c.percentualProSoluto ? c.percentualProSoluto.toFixed(1) : 0,
    c.sinalAVista,
    `"${c.status}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `atendimentos_inc_empreendimentos_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
