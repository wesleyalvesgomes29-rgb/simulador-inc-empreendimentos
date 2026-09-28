import React from 'react';
import { ArrowRight, ChevronLeft, ShieldAlert, Building2, Award, Percent, Wallet, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { McmvSimulationResult } from '../types';
import { formatBRL, formatPercent } from '../utils/formatters';

interface Step3McmvResultProps {
  simulationResult: McmvSimulationResult;
  nomeCliente?: string;
  onNext: () => void;
  onBack: () => void;
  onEditClientData: () => void;
}

export const Step3McmvResult: React.FC<Step3McmvResultProps> = ({
  simulationResult,
  nomeCliente,
  onNext,
  onBack,
  onEditClientData,
}) => {
  const {
    income,
    temDependente,
    isCotista,
    financiamento,
    subsidio,
    parcela,
    taxaJuros,
    faixa,
    enquadramentoNotice,
  } = simulationResult;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto px-4 py-6"
    >
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-5 md:p-7 shadow-xl shadow-black/40">
        {/* Step Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#262626]">
          <div>
            <span className="text-xs font-bold text-[#FF600B] uppercase tracking-wider block mb-1">
              Etapa 2 de 6 • ENQUADRAMENTO CAIXA
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              RESULTADO ESTIMADO MCMV
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

        {/* Client Profile Summary Card */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A] mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wider">
              Perfil Analisado {nomeCliente ? `• ${nomeCliente}` : ''}
            </span>
            <button
              type="button"
              onClick={onEditClientData}
              className="text-[11px] font-bold text-[#FF600B] hover:underline cursor-pointer"
            >
              Editar Dados
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-[#111111] p-2.5 rounded-xl border border-[#2A2A2A]">
              <span className="text-[10px] text-[#71717A] font-medium block">Renda Familiar</span>
              <span className="text-xs font-extrabold text-white">
                {formatBRL(income)}
              </span>
            </div>

            <div className="bg-[#111111] p-2.5 rounded-xl border border-[#2A2A2A]">
              <span className="text-[10px] text-[#71717A] font-medium block">FGTS (3+ anos)</span>
              <span className="text-xs font-extrabold text-[#FF600B]">
                {isCotista ? 'Cotista' : 'Não cotista'}
              </span>
            </div>

            <div className="bg-[#111111] p-2.5 rounded-xl border border-[#2A2A2A]">
              <span className="text-[10px] text-[#71717A] font-medium block">Dependente</span>
              <span className="text-xs font-extrabold text-white">
                {temDependente ? 'Sim' : 'Não'}
              </span>
            </div>
          </div>
        </div>

        {/* Enquadramento Notice if non-exact income */}
        {enquadramentoNotice && (
          <div className="bg-[#FF600B]/10 border border-[#FF600B]/30 p-3.5 rounded-2xl mb-6 flex items-start gap-2 text-xs text-[#FF7A00]">
            <Info className="w-4 h-4 text-[#FF600B] flex-shrink-0 mt-0.5" />
            <p className="leading-tight">{enquadramentoNotice}</p>
          </div>
        )}

        {/* Values Found in MCMV Table */}
        <div className="space-y-3.5 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FF600B]" />
              Potencial Encontrado na Tabela MCMV Associativo
            </h3>
            <span className="text-xs bg-[#FF600B]/15 text-[#FF600B] font-bold px-2.5 py-0.5 rounded-full border border-[#FF600B]/30">
              {faixa}
            </span>
          </div>

          {/* Financiamento Card */}
          <div className="bg-gradient-to-r from-[#FF600B]/15 via-[#1A1A1A] to-[#141414] p-4 rounded-2xl border-2 border-[#FF600B]/40 flex items-center justify-between shadow-md">
            <div>
              <span className="text-xs text-[#FF600B] font-bold uppercase tracking-wider block">
                Financiamento CAIXA Estimado
              </span>
              <span className="text-2xl font-black text-white">
                {formatBRL(financiamento)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF600B] to-[#D94D00] flex items-center justify-center text-white shadow-md shadow-[#FF600B]/30">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Subsídio Card */}
            <div className="bg-[#1A1A1A] p-3.5 rounded-2xl border border-[#2A2A2A]">
              <span className="text-[11px] text-[#FF600B] font-bold uppercase tracking-wider block mb-1">
                Subsídio MCMV
              </span>
              <span className="text-lg font-black text-white">
                {subsidio > 0 ? formatBRL(subsidio) : 'R$ 0,00'}
              </span>
              <span className="text-[10px] text-[#71717A] block mt-0.5">
                {subsidio > 0 ? 'Desconto do Governo' : 'Sem subsídio p/ faixa'}
              </span>
            </div>

            {/* Parcela Estimada */}
            <div className="bg-[#1A1A1A] p-3.5 rounded-2xl border border-[#2A2A2A]">
              <span className="text-[11px] text-[#A3A3A3] font-bold uppercase tracking-wider block mb-1">
                Parcela Estimada CAIXA
              </span>
              <span className="text-lg font-black text-white">
                {formatBRL(parcela)}
              </span>
              <span className="text-[10px] text-[#71717A] block mt-0.5">
                Tabela PRICE
              </span>
            </div>
          </div>

          {/* Taxa de juros */}
          <div className="bg-[#1A1A1A] p-3 rounded-xl border border-[#2A2A2A] flex items-center justify-between text-xs">
            <span className="text-[#A3A3A3] font-medium flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-[#FF600B]" />
              Taxa de Juros Anual
            </span>
            <span className="font-extrabold text-[#FF600B] bg-[#FF600B]/10 px-2 py-0.5 rounded border border-[#FF600B]/30">
              {formatPercent(taxaJuros)} a.a.
            </span>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="bg-[#1A1A1A] p-3.5 rounded-2xl border border-[#2A2A2A] flex items-start gap-2.5 mb-6 text-xs text-[#A3A3A3]">
          <ShieldAlert className="w-4 h-4 text-[#FF600B] flex-shrink-0 mt-0.5" />
          <p className="leading-tight">
            <strong className="text-white">Aviso legal:</strong> Valores aproximados para fins de simulação. A aprovação, subsídio, taxa, prazo e condições finais dependem da análise oficial da Caixa Econômica Federal e da documentação apresentada.
          </p>
        </div>

        {/* Continue to Imovel Button */}
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-gradient-to-r from-[#FF600B] to-[#D94D00] hover:opacity-95 text-white font-black text-sm md:text-base py-4 px-6 rounded-2xl shadow-xl shadow-[#FF600B]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Building2 className="w-5 h-5 text-white" />
          <span>SELECIONAR EMPREENDIMENTO INC</span>
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </motion.div>
  );
};
