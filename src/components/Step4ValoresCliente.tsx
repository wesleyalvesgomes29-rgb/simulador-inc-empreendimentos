import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { formatBRL, parseBRLInput } from '../utils/formatters';
import { PropertyDetails } from '../types';

interface Step4ValoresClienteProps {
  propertyDetails: PropertyDetails;
  valorImovel: number;
  financiamentoCaixa: number;
  subsidioCaixa: number;
  fgts: number;
  setFgts: (val: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4ValoresCliente: React.FC<Step4ValoresClienteProps> = ({
  propertyDetails,
  valorImovel,
  financiamentoCaixa,
  subsidioCaixa,
  fgts,
  setFgts,
  onNext,
  onBack,
}) => {
  const [displayFgts, setDisplayFgts] = useState<string>(
    fgts > 0 ? formatBRL(fgts) : ''
  );

  const handleFgtsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setFgts(numeric);
    setDisplayFgts(numeric > 0 ? formatBRL(numeric) : '');
  };

  const handlePresetFgts = (val: number) => {
    setFgts(val);
    setDisplayFgts(formatBRL(val));
  };

  // Balance to be paid as Entrada / Pró-Soluto with INC
  const saldoEntrada = Math.max(0, valorImovel - financiamentoCaixa - subsidioCaixa - fgts);
  const percentualProSoluto = valorImovel > 0 ? (saldoEntrada / valorImovel) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

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
              Etapa 4 de 6 • VALORES DA OPERAÇÃO
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#FF600B]" />
              VALORES & SALDO FGTS
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Summary Grid of Imóvel, Financiamento & Subsídio */}
          <div className="space-y-3">
            {/* Valor do Imóvel */}
            <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#2A2A2A] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#A3A3A3] font-bold uppercase tracking-wider block">
                  Valor do Imóvel
                </span>
                <span className="text-xl font-black text-white">
                  {formatBRL(valorImovel)}
                </span>
              </div>
              <span className="text-xs font-bold text-[#FF600B] bg-[#FF600B]/10 px-2.5 py-1 rounded-lg border border-[#FF600B]/20">
                {propertyDetails.nomeImovel} - INC
              </span>
            </div>

            {/* Financiamento & Subsídio */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1A1A1A] p-3.5 rounded-2xl border border-[#2A2A2A]">
                <span className="text-[11px] text-[#A3A3A3] font-bold uppercase tracking-wider block mb-1">
                  Financiamento CAIXA
                </span>
                <span className="text-lg font-black text-white">
                  {formatBRL(financiamentoCaixa)}
                </span>
                <span className="text-[10px] text-[#71717A] block mt-0.5">
                  Estimado MCMV
                </span>
              </div>

              <div className="bg-[#1A1A1A] p-3.5 rounded-2xl border border-[#2A2A2A]">
                <span className="text-[11px] text-[#FF600B] font-bold uppercase tracking-wider block mb-1">
                  Subsídio MCMV
                </span>
                <span className="text-lg font-black text-white">
                  {subsidioCaixa > 0 ? formatBRL(subsidioCaixa) : 'R$ 0,00'}
                </span>
                <span className="text-[10px] text-[#71717A] block mt-0.5">
                  Desconto do Governo
                </span>
              </div>
            </div>
          </div>

          {/* FGTS Input Field */}
          <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#2A2A2A]">
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#FF600B]" />
                Utilização do Saldo FGTS
              </span>
              <span className="text-[11px] text-[#71717A] font-normal lowercase">(opcional)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={displayFgts}
              onChange={handleFgtsChange}
              placeholder="R$ 0,00"
              className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#FF600B] focus:ring-1 focus:ring-[#FF600B]/30 text-white font-black text-xl rounded-2xl px-4 py-3 outline-none transition-all placeholder:text-[#52525B]"
            />

            {/* Quick Presets */}
            <div className="mt-3">
              <span className="text-[11px] text-[#A3A3A3] font-medium block mb-1.5">
                Atalhos rápidos de FGTS:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 5000, 10000, 20000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetFgts(preset)}
                    className={`text-xs py-1.5 px-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      fgts === preset
                        ? 'bg-[#FF600B] text-white border-[#FF600B] shadow-md shadow-[#FF600B]/30'
                        : 'bg-[#111111] text-[#B5B5B5] border-[#2A2A2A] hover:bg-[#262626] hover:text-white'
                    }`}
                  >
                    {preset === 0 ? 'Sem FGTS' : formatBRL(preset).replace(',00', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Highlighted Result Box: TOTAL ENTRADA / PRÓ-SOLUTO INC */}
          <div className="bg-gradient-to-br from-[#FF600B]/15 via-[#1A1A1A] to-[#141414] p-5 rounded-2xl border-2 border-[#FF600B] shadow-md space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#FF600B] uppercase tracking-wider block">
                TOTAL DA ENTRADA (PRÓ-SOLUTO INC)
              </span>
              <span className="bg-[#FF600B]/15 text-[#FF600B] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#FF600B]/30">
                {percentualProSoluto.toFixed(1)}% do Imóvel
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-black text-white tracking-tight">
                {formatBRL(saldoEntrada)}
              </span>
            </div>

            <p className="text-[11px] text-[#A3A3A3] font-medium pt-1 border-t border-[#262626]">
              Valor do Imóvel ({formatBRL(valorImovel)}) − Financiamento CAIXA ({formatBRL(financiamentoCaixa)}) − Subsídio ({formatBRL(subsidioCaixa)}) − FGTS ({formatBRL(fgts)})
            </p>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF600B] to-[#D94D00] hover:opacity-95 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-[#FF600B]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>CONTINUAR PARA O FLUXO PRÓ-SOLUTO INC</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
