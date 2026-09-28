/**
 * Formats a number to Brazilian Real string (e.g., R$ 3.200,00)
 */
export function formatBRL(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats percentage number (e.g., 4.25 -> "4,25%")
 */
export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0,00%';
  }
  return `${value.toFixed(2).replace('.', ',')}%`;
}

/**
 * Parses a BRL string or user input string into a number
 */
export function parseBRLInput(input: string): number {
  if (!input) return 0;
  // Remove non-digits
  const cleanNumber = input.replace(/\D/g, '');
  if (!cleanNumber) return 0;
  return parseFloat(cleanNumber) / 100;
}

/**
 * Format string while user is typing in currency input
 */
export function formatBRLInputFromNumber(amount: number): string {
  if (amount === 0) return 'R$ 0,00';
  return formatBRL(amount);
}

/**
 * Generates formatted text for WhatsApp share - INC Empreendimentos
 */
export interface WhatsAppMessageData {
  nomeCliente?: string;
  nomeImovel: string;
  construtora?: string;
  tipologia: string;
  unidade?: string;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidio: number;
  fgts: number;
  sinalAVista?: number;
  entradaTotal: number;
  percentualProSoluto?: number;
  parcelaObra?: { qtd: number; valor: number; correcao?: string };
  parcelaPosObra?: { qtd: number; valor: number; correcao?: string };
  intermediarias?: Array<{ valor: number; mesOuPeriodo?: string }>;
  parcelaCaixa?: number;
  taxaJuros?: number;
  faixaMcmv?: string;
  incluirDocumentacao?: boolean;
  valorDocumentacao?: number;
  parcelasDocumentacao?: number;
}

export function buildWhatsAppText(data: WhatsAppMessageData): string {
  const saudacao = data.nomeCliente && data.nomeCliente.trim() !== ''
    ? `Olá, *${data.nomeCliente.trim()}*!`
    : 'Olá!';

  let message = `${saudacao} Aqui está a sua *Simulação INC Empreendimentos* (Programa Minha Casa, Minha Vida 2026):\n\n`;
  message += `🏢 *Empreendimento:* ${data.nomeImovel} - INC Empreendimentos\n`;
  message += `📐 *Tipologia:* ${data.tipologia}\n`;
  if (data.unidade && data.unidade.trim() !== '') {
    message += `🚪 *Unidade / Bloco:* ${data.unidade.trim()}\n`;
  }
  message += `📍 *Localização:* Uberlândia / MG\n`;
  message += `💰 *Valor do Imóvel:* ${formatBRL(data.valorImovel)}\n\n`;

  message += `🏦 *COMPOSIÇÃO DO FINANCIAMENTO CAIXA (MCMV):*\n`;
  message += `• *Financiamento CAIXA:* ${formatBRL(data.financiamentoCaixa)}\n`;
  if (data.parcelaCaixa && data.parcelaCaixa > 0) {
    message += `• *Parcela Estimada CAIXA:* ${formatBRL(data.parcelaCaixa)} (Tabela PRICE)\n`;
  }
  if (data.subsidio > 0) {
    message += `• *Subsídio MCMV:* ${formatBRL(data.subsidio)} (Desconto do Governo Federal)\n`;
  }
  if (data.fgts > 0) {
    message += `• *FGTS Utilizado:* ${formatBRL(data.fgts)}\n`;
  }
  if (data.taxaJuros && data.taxaJuros > 0) {
    message += `• *Taxa de Juros:* ${formatPercent(data.taxaJuros)} a.a.\n`;
  }

  message += `\n📋 *FLUXO DE ENTRADA PRÓ-SOLUTO INC:*\n`;
  const pctStr = data.percentualProSoluto ? ` (${data.percentualProSoluto.toFixed(1)}% do imóvel)` : '';
  message += `• *Total Entrada Pró-Soluto:* ${formatBRL(data.entradaTotal)}${pctStr}\n`;

  if (data.sinalAVista && data.sinalAVista > 0) {
    message += `• *Sinal / Ato:* ${formatBRL(data.sinalAVista)}\n`;
  }

  if (data.parcelaObra && data.parcelaObra.qtd > 0 && data.parcelaObra.valor > 0) {
    const corrObra = data.parcelaObra.correcao ? ` (${data.parcelaObra.correcao})` : ' (INCC)';
    message += `• *Durante a Obra:* ${data.parcelaObra.qtd}x de ${formatBRL(data.parcelaObra.valor)}${corrObra}\n`;
  }

  if (data.parcelaPosObra && data.parcelaPosObra.qtd > 0 && data.parcelaPosObra.valor > 0) {
    const corrPos = data.parcelaPosObra.correcao ? ` (${data.parcelaPosObra.correcao})` : ' (IPCA + 1,99% a.a.)';
    message += `• *Pós-Chaves / Pós-Obra:* ${data.parcelaPosObra.qtd}x de ${formatBRL(data.parcelaPosObra.valor)}${corrPos}\n`;
  }

  if (data.intermediarias && data.intermediarias.length > 0) {
    const totalInterm = data.intermediarias.reduce((sum, item) => sum + (item.valor || 0), 0);
    message += `• *Intermediárias / Balões:* ${data.intermediarias.length}x (Total: ${formatBRL(totalInterm)})\n`;
    data.intermediarias.forEach((item, idx) => {
      message += `  - ${idx + 1}ª: ${formatBRL(item.valor)} (${item.mesOuPeriodo || 'Período a definir'})\n`;
    });
  }

  if (data.incluirDocumentacao && data.valorDocumentacao && data.valorDocumentacao > 0) {
    const parc = data.parcelasDocumentacao && data.parcelasDocumentacao > 1
      ? ` (em até ${data.parcelasDocumentacao}x de ${formatBRL(data.valorDocumentacao / data.parcelasDocumentacao)})`
      : '';
    message += `\n📄 *Documentação (ITBI + Registro):* ${formatBRL(data.valorDocumentacao)}${parc}\n`;
  }

  message += `\n🏢 *INC Empreendimentos*\n`;
  message += `Transformando o sonho da casa própria em realidade em Uberlândia/MG.\n`;
  message += `\n⚠️ *Aviso Legal:* Valores aproximados para fins de simulação. A aprovação, subsídio, taxa, prazo e condições finais dependem da análise oficial da Caixa Econômica Federal e da documentação apresentada.`;

  return message;
}

export function openWhatsApp(message: string) {
  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Phone / WhatsApp Mask: (34) 99999-9999
 */
export function formatPhoneMask(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * CPF Mask: 000.000.000-00
 */
export function formatCpfMask(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Copy text to clipboard safely
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Erro ao copiar para área de transferência:', err);
    return false;
  }
}
