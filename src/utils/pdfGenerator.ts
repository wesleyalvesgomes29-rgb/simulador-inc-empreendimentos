import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { McmvSimulationResult, PropertyDetails, ThemeMode } from '../types';
import { formatBRL, formatPercent } from './formatters';

interface GeneratePdfParams {
  nomeCliente: string;
  whatsapp: string;
  email?: string;
  cpf?: string;
  imovelInfo: PropertyDetails;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidioCaixa: number;
  fgts: number;
  sinalAVista: number;
  valorEntradaTotal: number;
  percentualProSoluto: number;
  qtdParcelasObra: number;
  valorParcelaObra: number;
  correcaoObra: string;
  qtdParcelasPosObra: number;
  valorParcelaPosObra: number;
  correcaoPosObra: string;
  intermediarias?: Array<{ valor: number; mesOuPeriodo?: string }>;
  simulationResult: McmvSimulationResult;
  incluirDocumentacao?: boolean;
  valorDocumentacao?: number;
  parcelasDocumentacao?: number;
  theme?: ThemeMode;
}

export async function generateProposalPdf(params: GeneratePdfParams): Promise<void> {
  const {
    nomeCliente,
    whatsapp,
    email,
    cpf,
    imovelInfo,
    valorImovel,
    financiamentoCaixa,
    subsidioCaixa,
    fgts,
    sinalAVista,
    valorEntradaTotal,
    percentualProSoluto,
    qtdParcelasObra,
    valorParcelaObra,
    correcaoObra,
    qtdParcelasPosObra,
    valorParcelaPosObra,
    correcaoPosObra,
    intermediarias = [],
    simulationResult,
    incluirDocumentacao,
    valorDocumentacao = 6800,
    parcelasDocumentacao = 36,
    theme = 'dark',
  } = params;

  const totalIntermediarias = intermediarias.reduce((sum, item) => sum + (item.valor || 0), 0);

  // Theme-specific colors
  const isLight = theme === 'light';
  const bgColor = isLight ? '#F8FAFC' : '#0A0A0A';
  const cardBg = isLight ? '#FFFFFF' : '#141414';
  const subCardBg = isLight ? '#F8FAFC' : '#1A1A1A';
  const innerBoxBg = isLight ? '#FFFFFF' : '#111111';
  const borderColor = isLight ? '#E2E8F0' : '#2A2A2A';
  const borderLight = isLight ? '#E2E8F0' : '#222222';
  const textColor = isLight ? '#0F172A' : '#F5F5F5';
  const textMuted = isLight ? '#475569' : '#B5B5B5';
  const textSubtle = isLight ? '#64748B' : '#71717A';
  const headerGradient = isLight 
    ? 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)' 
    : 'linear-gradient(135deg, #1A1A1A 0%, #111111 100%)';
  const cardShadow = isLight 
    ? '0 10px 30px rgba(15, 23, 42, 0.08)' 
    : '0 10px 30px rgba(0, 0, 0, 0.6)';

  // Create temporary offscreen container for PDF rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.padding = '32px';
  container.style.backgroundColor = bgColor;
  container.style.color = textColor;
  container.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  container.innerHTML = `
    <div style="border: 2px solid ${borderColor}; border-radius: 20px; padding: 28px; background-color: ${cardBg}; box-sizing: border-box; box-shadow: ${cardShadow};">
      
      <!-- Top Brand Header with INC Orange Accent Banner -->
      <div style="background: ${headerGradient}; border: 1px solid ${borderColor}; border-left: 6px solid #FF600B; border-radius: 14px; padding: 20px 24px; margin-bottom: 20px; color: ${textColor}; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #FF600B 0%, #D94D00 100%); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; color: #FFFFFF; box-shadow: 0 4px 14px rgba(255, 96, 11, 0.35);">
            INC
          </div>
          <div>
            <h1 style="font-size: 22px; font-weight: 900; color: ${textColor}; margin: 0; letter-spacing: -0.5px; text-transform: uppercase;">INC EMPREENDIMENTOS</h1>
            <p style="font-size: 11px; font-weight: 700; color: #FF600B; margin: 3px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">SIMULADOR MCMV 2026 • ESTIMATIVA COMERCIAL</p>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="background-color: ${isLight ? 'rgba(255, 96, 11, 0.1)' : 'rgba(255, 96, 11, 0.15)'}; color: #FF600B; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 900; display: inline-block; letter-spacing: 0.5px; border: 1px solid rgba(255, 96, 11, 0.3);">
            PROPOSTA COMERCIAL
          </span>
          <p style="font-size: 11px; color: ${textMuted}; margin: 6px 0 0 0; font-weight: 600;">Emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <!-- Customer & Profile Info -->
      <div style="background-color: ${subCardBg}; border: 1px solid ${borderColor}; border-radius: 14px; padding: 16px; margin-bottom: 16px;">
        <h3 style="font-size: 11px; font-weight: 800; color: #FF600B; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">DADOS DO CLIENTE & ENQUADRAMENTO MCMV</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
          <div style="color: ${textMuted};"><strong style="color: ${textColor};">Cliente:</strong> ${nomeCliente || 'Não informado'}</div>
          <div style="color: ${textMuted};"><strong style="color: ${textColor};">WhatsApp:</strong> ${whatsapp || 'Não informado'}</div>
          ${email ? `<div style="color: ${textMuted};"><strong style="color: ${textColor};">E-mail:</strong> ${email}</div>` : ''}
          ${cpf ? `<div style="color: ${textMuted};"><strong style="color: ${textColor};">CPF:</strong> ${cpf}</div>` : ''}
          <div style="color: ${textMuted};"><strong style="color: ${textColor};">Renda Familiar:</strong> ${formatBRL(simulationResult.income)}</div>
          <div style="color: ${textMuted};"><strong style="color: ${textColor};">Perfil MCMV:</strong> ${simulationResult.perfilLabel} (${simulationResult.faixa})</div>
        </div>
      </div>

      <!-- Property Details -->
      <div style="background-color: ${subCardBg}; border: 1px solid ${borderColor}; border-radius: 14px; padding: 16px; margin-bottom: 16px;">
        <h3 style="font-size: 11px; font-weight: 800; color: #FF600B; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">EMPREENDIMENTO INC</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
          <div style="color: ${textMuted};"><strong style="color: ${textColor};">Empreendimento:</strong> ${imovelInfo.nomeImovel} - INC Empreendimentos</div>
          <div style="color: ${textMuted};"><strong style="color: ${textColor};">Tipologia:</strong> ${imovelInfo.tipologia}</div>
          ${imovelInfo.unidade ? `<div style="color: ${textMuted};"><strong style="color: ${textColor};">Unidade:</strong> ${imovelInfo.unidade}</div>` : ''}
          <div style="color: ${textMuted};"><strong style="color: ${textColor};">Localização:</strong> ${imovelInfo.localizacao || 'Uberlândia - MG'}</div>
          <div style="grid-column: span 2; background-color: ${innerBoxBg}; border: 1px solid ${borderColor}; padding: 12px 16px; border-radius: 10px; margin-top: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; font-weight: 700; color: ${textMuted};">VALOR DO IMÓVEL:</span>
            <strong style="color: #FF600B; font-size: 18px; font-weight: 900;">${formatBRL(valorImovel)}</strong>
          </div>
        </div>
      </div>

      <!-- Financing & Subsidies Breakdown -->
      <div style="background-color: ${subCardBg}; border: 1px solid ${borderColor}; border-radius: 14px; padding: 16px; margin-bottom: 16px;">
        <h3 style="font-size: 11px; font-weight: 800; color: #FF600B; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">COMPOSIÇÃO DO FINANCIAMENTO CAIXA (MCMV)</h3>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span style="color: ${textMuted};">Financiamento CAIXA Estimado:</span>
          <strong style="color: ${textColor};">${formatBRL(financiamentoCaixa)}</strong>
        </div>

        ${simulationResult.parcela > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span style="color: ${textMuted};">Parcela Estimada CAIXA (${simulationResult.faixa}):</span>
          <strong style="color: ${textColor};">${formatBRL(simulationResult.parcela)} (Tabela PRICE)</strong>
        </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span style="color: ${textMuted};">Subsídio MCMV (${simulationResult.faixa}):</span>
          <strong style="color: #FF600B;">${formatBRL(subsidioCaixa)} (Desconto do Governo)</strong>
        </div>

        ${fgts > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
          <span style="color: ${textMuted};">Utilização de Saldo FGTS:</span>
          <strong style="color: ${textColor};">${formatBRL(fgts)}</strong>
        </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid ${borderColor}; font-size: 14px; font-weight: 900; color: #FF600B;">
          <span>ENTRADA TOTAL / PRÓ-SOLUTO INC:</span>
          <span>${formatBRL(valorEntradaTotal)} (${percentualProSoluto.toFixed(1)}% do imóvel)</span>
        </div>
      </div>

      <!-- Construction / Developer Entry Flow Breakdown -->
      <div style="background-color: ${subCardBg}; border: 1px solid ${borderColor}; border-radius: 14px; padding: 16px; margin-bottom: 16px;">
        <h3 style="font-size: 11px; font-weight: 800; color: #FF600B; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">FLUXO DE PAGAMENTO DA ENTRADA (PRÓ-SOLUTO INC)</h3>
        
        ${sinalAVista > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; background-color: ${innerBoxBg}; border: 1px solid ${borderColor}; padding: 10px 14px; border-radius: 8px;">
          <span style="color: ${textMuted};">Sinal / Ato Inicial (em dinheiro):</span>
          <strong style="color: #FF600B; font-size: 15px;">${formatBRL(sinalAVista)}</strong>
        </div>
        ` : ''}

        <div style="display: grid; grid-template-columns: ${qtdParcelasPosObra > 0 ? '1fr 1fr' : '1fr'}; gap: 12px; margin-bottom: 12px;">
          ${qtdParcelasObra > 0 ? `
          <div style="background-color: ${innerBoxBg}; padding: 14px; border-radius: 10px; border: 1px solid #FF600B;">
            <div style="font-size: 11px; font-weight: 800; color: #FF600B; text-transform: uppercase;">DURANTE A OBRA (${qtdParcelasObra}x)</div>
            <div style="font-size: 19px; font-weight: 900; color: ${textColor}; margin-top: 4px;">${formatBRL(valorParcelaObra)}</div>
            <div style="font-size: 10px; color: ${textMuted}; margin-top: 2px;">Correção: ${correcaoObra || 'INCC'}</div>
          </div>
          ` : ''}

          ${qtdParcelasPosObra > 0 ? `
          <div style="background-color: ${innerBoxBg}; padding: 14px; border-radius: 10px; border: 1px solid ${borderColor};">
            <div style="font-size: 11px; font-weight: 800; color: #FF7A00; text-transform: uppercase;">PÓS-CHAVES / PÓS-OBRA (${qtdParcelasPosObra}x)</div>
            <div style="font-size: 19px; font-weight: 900; color: ${textColor}; margin-top: 4px;">${formatBRL(valorParcelaPosObra)}</div>
            <div style="font-size: 10px; color: ${textMuted}; margin-top: 2px;">Correção: ${correcaoPosObra || 'IPCA + 1,99% a.a.'}</div>
          </div>
          ` : ''}
        </div>

        ${totalIntermediarias > 0 ? `
        <div style="background-color: ${innerBoxBg}; border: 1px solid ${borderColor}; border-left: 4px solid #FF600B; padding: 12px 14px; border-radius: 8px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #FF600B; text-transform: uppercase;">INTERMEDIÁRIAS / BALÕES (${intermediarias.length}x)</span>
            <strong style="color: ${textColor}; font-size: 13px;">Total: ${formatBRL(totalIntermediarias)}</strong>
          </div>
          <div style="font-size: 12px; color: ${textMuted};">
            ${intermediarias.map((item, idx) => `
              <div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: ${idx < intermediarias.length - 1 ? `1px dashed ${borderLight}` : 'none'};">
                <span>${idx + 1}ª Intermediária (${item.mesOuPeriodo || 'Período a definir'}):</span>
                <strong style="color: ${textColor};">${formatBRL(item.valor)}</strong>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Legal / Footer Notes -->
      <div style="font-size: 10px; color: ${textSubtle}; line-height: 1.5; border-top: 1px solid ${borderColor}; padding-top: 14px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="max-width: 500px;">
          ${incluirDocumentacao ? `<p style="margin: 0 0 3px 0; color: ${textMuted};"><strong style="color: ${textColor};">Documentação (Registro + ITBI):</strong> ${formatBRL(valorDocumentacao)} em até ${parcelasDocumentacao}x.</p>` : ''}
          <p style="margin: 0 0 3px 0;">* Valores aproximados para fins de simulação. A aprovação, subsídio, taxa, prazo e condições finais dependem da análise oficial da Caixa Econômica Federal e da documentação apresentada.</p>
          <p style="margin: 0;">* Valores e condições podem sofrer alterações sem aviso prévio conforme política comercial da INC Empreendimentos.</p>
        </div>
        <div style="text-align: right;">
          <strong style="color: ${textColor}; font-size: 11px; display: block;">INC EMPREENDIMENTOS</strong>
          <span style="color: #FF600B; font-size: 10px; font-weight: 700;">Simulador MCMV • Estimativa Comercial</span>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: bgColor,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
    
    const clientSanitized = (nomeCliente || 'cliente').replace(/[^a-zA-Z0-9]/g, '_');
    const imovelSanitized = (imovelInfo.nomeImovel || 'imovel').replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`Proposta_INC_${imovelSanitized}_${clientSanitized}.pdf`);
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
  } finally {
    document.body.removeChild(container);
  }
}
