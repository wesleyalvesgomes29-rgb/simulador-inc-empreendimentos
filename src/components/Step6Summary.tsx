import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Edit3, 
  MessageSquare, 
  RotateCcw, 
  ShieldCheck, 
  User, 
  Wallet, 
  Building2, 
  Info,
  Copy,
  Check,
  Phone,
  Mail,
  FileText,
  FileDown,
  Percent
} from 'lucide-react';
import { motion } from 'motion/react';
import { McmvSimulationResult, PropertyDetails, IntermediariaItem, ThemeMode } from '../types';
import { formatBRL, formatPercent, openWhatsApp, buildWhatsAppText, copyToClipboard } from '../utils/formatters';
import { generateCrmText, ClientLead, saveClientLead } from '../utils/clientStorage';
import { generateProposalPdf } from '../utils/pdfGenerator';

interface Step6SummaryProps {
  nomeCliente: string;
  whatsapp?: string;
  email?: string;
  cpf?: string;
  propertyDetails: PropertyDetails;
  simulationResult: McmvSimulationResult;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidioCaixa: number;
  fgts: number;
  sinalAVista: number;
  qtdParcelasObra: number;
  valorParcelaObra?: number;
  qtdParcelasPosObra: number;
  valorParcelaPosObra?: number;
  correcaoObra: string;
  correcaoPosObra: string;
  intermediarias?: IntermediariaItem[];
  incluirDocumentacao: boolean;
  valorDocumentacao: number;
  parcelasDocumentacao: number;
  theme?: ThemeMode;
  onBack: () => void;
  onEditStep: (step: 'dados_cliente' | 'escolha_imovel' | 'valores_cliente' | 'fluxo_construtora') => void;
  onNewSimulation: () => void;
}

export const Step6Summary: React.FC<Step6SummaryProps> = ({
  nomeCliente,
  whatsapp = '',
  email = '',
  cpf = '',
  propertyDetails,
  simulationResult,
  valorImovel,
  financiamentoCaixa,
  subsidioCaixa,
  fgts,
  sinalAVista,
  qtdParcelasObra,
  valorParcelaObra = 0,
  qtdParcelasPosObra,
  valorParcelaPosObra = 0,
  correcaoObra,
  correcaoPosObra,
  intermediarias = [],
  incluirDocumentacao,
  valorDocumentacao,
  parcelasDocumentacao,
  theme = 'dark' as ThemeMode,
  onBack,
  onEditStep,
  onNewSimulation,
}) => {
  const { income, temDependente, isCotista, parcela, taxaJuros, faixa } = simulationResult;
  const [copied, setCopied] = useState<boolean>(false);
  const [leadSaved, setLeadSaved] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Total Entrada / Pró-Soluto calculation
  const valorEntradaTotal = Math.max(0, valorImovel - financiamentoCaixa - subsidioCaixa - fgts);
  const percentualProSoluto = valorImovel > 0 ? (valorEntradaTotal / valorImovel) * 100 : 0;
  const dentroLimite23 = percentualProSoluto <= 23.01;

  const totalIntermediarias = (intermediarias || []).reduce((acc, it) => acc + (it.valor || 0), 0);

  const handleShareWhatsApp = () => {
    const message = buildWhatsAppText({
      nomeCliente,
      nomeImovel: propertyDetails.nomeImovel,
      construtora: propertyDetails.construtora,
      tipologia: propertyDetails.tipologia,
      unidade: propertyDetails.unidade,
      valorImovel,
      financiamentoCaixa,
      subsidio: subsidioCaixa,
      fgts,
      sinalAVista,
      entradaTotal: valorEntradaTotal,
      percentualProSoluto,
      intermediarias: intermediarias.length > 0 ? intermediarias : undefined,
      parcelaObra: qtdParcelasObra > 0 ? { qtd: qtdParcelasObra, valor: valorParcelaObra, correcao: correcaoObra } : undefined,
      parcelaPosObra: qtdParcelasPosObra > 0 ? { qtd: qtdParcelasPosObra, valor: valorParcelaPosObra, correcao: correcaoPosObra } : undefined,
      parcelaCaixa: parcela,
      taxaJuros,
      faixaMcmv: faixa,
      incluirDocumentacao,
      valorDocumentacao,
      parcelasDocumentacao,
    });
    openWhatsApp(message);
  };

  const handleSaveLead = () => {
    const leadObj: Omit<ClientLead, 'id' | 'dataCriacao' | 'dataAtualizacao'> = {
      nome: nomeCliente,
      whatsapp,
      email,
      cpf,
      renda: income,
      temDependente,
      isCotista,
      imovelInfo: propertyDetails,
      valorImovel,
      financiamentoCaixa,
      subsidioCaixa,
      fgts,
      sinalAVista,
      valorEntradaTotal,
      percentualProSoluto,
      intermediarias: intermediarias.length > 0 ? intermediarias : undefined,
      qtdParcelasObra,
      valorParcelaObra,
      qtdParcelasPosObra,
      valorParcelaPosObra,
      status: 'Proposta Gerada',
    };
    saveClientLead(leadObj);
    setLeadSaved(true);
  };

  const handleCopyCrmData = async () => {
    const leadObj: ClientLead = {
      id: 'current',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      nome: nomeCliente,
      whatsapp,
      email,
      cpf,
      renda: income,
      temDependente,
      isCotista,
      imovelInfo: propertyDetails,
      valorImovel,
      financiamentoCaixa,
      subsidioCaixa,
      fgts,
      sinalAVista,
      valorEntradaTotal,
      percentualProSoluto,
      intermediarias: intermediarias.length > 0 ? intermediarias : undefined,
      qtdParcelasObra,
      valorParcelaObra,
      qtdParcelasPosObra,
      valorParcelaPosObra,
      status: 'Proposta Gerada',
    };

    const text = generateCrmText(leadObj);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateProposalPdf({
        nomeCliente,
        whatsapp,
        email,
        cpf,
        imovelInfo: propertyDetails,
        valorImovel,
        financiamentoCaixa,
        subsidioCaixa,
        fgts,
        sinalAVista,
        valorEntradaTotal,
        percentualProSoluto,
        intermediarias: intermediarias.length > 0 ? intermediarias : undefined,
        qtdParcelasObra,
        valorParcelaObra,
        correcaoObra,
        qtdParcelasPosObra,
        valorParcelaPosObra,
        correcaoPosObra,
        simulationResult,
        incluirDocumentacao,
        valorDocumentacao,
        parcelasDocumentacao,
        theme,
      });
    } catch (err) {
      console.error('Erro ao gerar PDF INC:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto px-4 py-6"
    >
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-5 md:p-7 shadow-xl shadow-black/40 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div>
            <span className="text-xs font-bold text-[#FF600B] uppercase tracking-wider block mb-1">
              Etapa 6 de 6 • PROPOSTA COMERCIAL
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF600B]" />
              RESUMO DA SIMULAÇÃO INC
            </h2>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-[#A3A3A3] hover:text-white bg-[#1E1E1E] hover:bg-[#2A2A2A] px-3 py-2 rounded-xl transition-colors cursor-pointer border border-[#2A2A2A]"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {/* 1. DADOS DO CLIENTE */}
        <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#2A2A2A] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
            <span className="text-xs font-black text-[#FF600B] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#FF600B]" />
              DADOS DO CLIENTE & ENQUADRAMENTO
            </span>
            <button
              type="button"
              onClick={() => onEditStep('dados_cliente')}
              className="text-xs text-[#A3A3A3] hover:text-[#FF600B] flex items-center gap-1 cursor-pointer font-bold"
            >
              <Edit3 className="w-3 h-3" />
              Editar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-[#A3A3A3]">
            <div><strong className="text-white">Nome:</strong> {nomeCliente || 'Não informado'}</div>
            <div><strong className="text-white">WhatsApp:</strong> {whatsapp || 'Não informado'}</div>
            {email && <div><strong className="text-white">E-mail:</strong> {email}</div>}
            {cpf && <div><strong className="text-white">CPF:</strong> {cpf}</div>}
            <div><strong className="text-white">Renda Familiar:</strong> {formatBRL(income)}</div>
            <div><strong className="text-white">MCMV:</strong> {simulationResult.perfilLabel} ({faixa})</div>
          </div>
        </div>

        {/* 2. EMPREENDIMENTO INC */}
        <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#2A2A2A] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
            <span className="text-xs font-black text-[#FF600B] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#FF600B]" />
              EMPREENDIMENTO INC
            </span>
            <button
              type="button"
              onClick={() => onEditStep('escolha_imovel')}
              className="text-xs text-[#A3A3A3] hover:text-[#FF600B] flex items-center gap-1 cursor-pointer font-bold"
            >
              <Edit3 className="w-3 h-3" />
              Editar
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-[#A3A3A3]">
            <div className="flex justify-between">
              <span>Empreendimento:</span>
              <strong className="text-white">{propertyDetails.nomeImovel} - INC Empreendimentos</strong>
            </div>
            <div className="flex justify-between">
              <span>Tipologia:</span>
              <strong className="text-white">{propertyDetails.tipologia}</strong>
            </div>
            {propertyDetails.unidade && (
              <div className="flex justify-between">
                <span>Unidade:</span>
                <strong className="text-white">{propertyDetails.unidade}</strong>
              </div>
            )}
            <div className="flex justify-between">
              <span>Localização:</span>
              <strong className="text-white">{propertyDetails.localizacao || 'Uberlândia - MG'}</strong>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#2A2A2A] text-sm">
              <span className="font-bold text-white">Valor do Imóvel:</span>
              <span className="font-black text-[#FF600B] text-lg">{formatBRL(valorImovel)}</span>
            </div>
          </div>
        </div>

        {/* 3. COMPOSIÇÃO FINANCIAMENTO CAIXA */}
        <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#2A2A2A] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
            <span className="text-xs font-black text-[#FF600B] uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#FF600B]" />
              COMPOSIÇÃO CAIXA (MCMV)
            </span>
            <button
              type="button"
              onClick={() => onEditStep('valores_cliente')}
              className="text-xs text-[#A3A3A3] hover:text-[#FF600B] flex items-center gap-1 cursor-pointer font-bold"
            >
              <Edit3 className="w-3 h-3" />
              Editar
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#A3A3A3]">
              <span>Financiamento CAIXA:</span>
              <strong className="text-white">{formatBRL(financiamentoCaixa)}</strong>
            </div>
            {parcela > 0 && (
              <div className="flex justify-between text-[#A3A3A3]">
                <span>Parcela Estimada CAIXA:</span>
                <strong className="text-white">{formatBRL(parcela)} (Tabela PRICE)</strong>
              </div>
            )}
            <div className="flex justify-between text-[#A3A3A3]">
              <span>Subsídio Governamental:</span>
              <strong className="text-[#FF600B]">{formatBRL(subsidioCaixa)}</strong>
            </div>
            {fgts > 0 && (
              <div className="flex justify-between text-[#A3A3A3]">
                <span>Utilização FGTS:</span>
                <strong className="text-white">{formatBRL(fgts)}</strong>
              </div>
            )}
            {taxaJuros > 0 && (
              <div className="flex justify-between text-[#A3A3A3]">
                <span>Taxa de Juros:</span>
                <strong className="text-white">{formatPercent(taxaJuros)} a.a.</strong>
              </div>
            )}
          </div>
        </div>

        {/* 4. FLUXO DE ENTRADA PRÓ-SOLUTO INC */}
        <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border-2 border-[#FF600B]/40 space-y-3">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
            <div>
              <span className="text-xs font-black text-[#FF600B] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF600B]" />
                FLUXO DE ENTRADA PRÓ-SOLUTO INC
              </span>
              <span className="text-[10px] text-[#A3A3A3] font-bold">
                {percentualProSoluto.toFixed(1)}% do imóvel {dentroLimite23 ? '• Conforme regra 23%' : '• Acima de 23%'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep('fluxo_construtora')}
              className="text-xs text-[#A3A3A3] hover:text-[#FF600B] flex items-center gap-1 cursor-pointer font-bold"
            >
              <Edit3 className="w-3 h-3" />
              Editar
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-white font-bold">
              <span>Total da Entrada:</span>
              <span className="text-[#FF600B] font-black text-sm">{formatBRL(valorEntradaTotal)}</span>
            </div>

            {sinalAVista > 0 && (
              <div className="flex justify-between text-[#A3A3A3] bg-[#111111] p-2 rounded-lg border border-[#2A2A2A]">
                <span>Sinal / Ato Inicial:</span>
                <strong className="text-white">{formatBRL(sinalAVista)}</strong>
              </div>
            )}

            {intermediarias && intermediarias.length > 0 && totalIntermediarias > 0 && (
              <div className="bg-[#111111] p-2.5 rounded-lg border border-[#2A2A2A] space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#FF600B]">Intermediárias / Balões ({intermediarias.length}x):</span>
                  <strong className="text-white">{formatBRL(totalIntermediarias)}</strong>
                </div>
                <div className="space-y-1 pt-1 border-t border-[#222222]">
                  {intermediarias.map((item, idx) => (
                    <div key={item.id || idx} className="flex justify-between text-[11px] text-[#A3A3A3]">
                      <span>• {idx + 1}ª Intermediária ({item.mesOuPeriodo || `Mês ${(idx + 1) * 6}`}):</span>
                      <strong className="text-white">{formatBRL(item.valor)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {qtdParcelasObra > 0 && valorParcelaObra > 0 && (
              <div className="flex justify-between text-[#A3A3A3] bg-[#111111] p-2 rounded-lg border border-[#2A2A2A]">
                <span>Durante a Obra ({qtdParcelasObra}x):</span>
                <strong className="text-[#FF600B]">{formatBRL(valorParcelaObra)} ({correcaoObra || 'INCC'})</strong>
              </div>
            )}

            {qtdParcelasPosObra > 0 && valorParcelaPosObra > 0 && (
              <div className="flex justify-between text-[#A3A3A3] bg-[#111111] p-2 rounded-lg border border-[#2A2A2A]">
                <span>Pós-Chaves / Pós-Obra ({qtdParcelasPosObra}x):</span>
                <strong className="text-[#FF7A00]">{formatBRL(valorParcelaPosObra)} ({correcaoPosObra || 'IPCA + 1,99% a.a.'})</strong>
              </div>
            )}

            {incluirDocumentacao && valorDocumentacao > 0 && (
              <div className="flex justify-between text-[#A3A3A3] bg-[#111111] p-2 rounded-lg border border-[#2A2A2A]">
                <span>Documentação ({parcelasDocumentacao}x):</span>
                <strong className="text-white">{formatBRL(valorDocumentacao)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* 5. AÇÕES COMERCIAIS */}
        <div className="space-y-3 pt-2">
          {/* Botão WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-sm md:text-base py-3.5 px-5 rounded-2xl shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
          >
            <MessageSquare className="w-5 h-5" />
            <span>ENVIAR PROPOSTA NO WHATSAPP</span>
          </button>

          {/* Botão Baixar PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="w-full bg-[#1A1A1A] hover:bg-[#262626] border-2 border-[#FF600B] text-[#FF600B] hover:text-white font-black text-sm md:text-base py-3.5 px-5 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            <FileDown className="w-5 h-5 text-[#FF600B]" />
            <span>{isGeneratingPdf ? 'GERANDO PROPOSTA EM PDF...' : 'BAIXAR PROPOSTA EM PDF'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Copiar CRM */}
            <button
              type="button"
              onClick={handleCopyCrmData}
              className="py-3 px-3 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-[#2A2A2A] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#A3A3A3]" />
                  <span>Copiar CRM</span>
                </>
              )}
            </button>

            {/* Salvar Lead */}
            <button
              type="button"
              onClick={handleSaveLead}
              className={`py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                leadSaved
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#1A1A1A] hover:bg-[#262626] border-[#2A2A2A] text-white'
              }`}
            >
              {leadSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Salvo nos Atendimentos</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-[#FF600B]" />
                  <span>Salvar Atendimento</span>
                </>
              )}
            </button>
          </div>

          {/* Nova Simulação */}
          <button
            type="button"
            onClick={onNewSimulation}
            className="w-full text-center py-2.5 text-xs text-[#A3A3A3] hover:text-white font-bold cursor-pointer transition-colors"
          >
            ← Iniciar Nova Simulação
          </button>
        </div>
      </div>
    </motion.div>
  );
};
