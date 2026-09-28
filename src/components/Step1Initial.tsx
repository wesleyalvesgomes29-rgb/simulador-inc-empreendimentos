import React from 'react';
import { ArrowRight, Building2, Calculator, ShieldCheck, Sparkles, User } from 'lucide-react';
import { motion } from 'motion/react';

interface Step1InitialProps {
  nomeCliente: string;
  setNomeCliente: (val: string) => void;
  onStartSimulation: () => void;
}

export const Step1Initial: React.FC<Step1InitialProps> = ({
  nomeCliente,
  setNomeCliente,
  onStartSimulation,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-6"
    >
      <div className="w-full max-w-md bg-[#161616] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF600B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FF600B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* INC Header Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FF600B]/10 border border-[#FF600B]/30 px-3.5 py-1.5 rounded-full text-[#FF600B] text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FF600B]" />
          <span>Minha Casa, Minha Vida 2026</span>
        </div>

        {/* Development Header Visual */}
        <div className="flex items-center gap-3 mb-6 bg-[#111111] p-3.5 rounded-2xl border border-[#2A2A2A]">
          <div className="w-12 h-12 rounded-xl bg-[#FF600B] flex items-center justify-center text-white font-black shadow-md flex-shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Park Jardim do Sol
            </h2>
            <p className="text-xs text-[#FF600B] font-bold">
              INC Empreendimentos • Uberlândia / MG
            </p>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-3">
            SIMULADOR MCMV
          </h1>
          <p className="text-[#B5B5B5] text-sm font-medium leading-relaxed">
            Simule o potencial de financiamento e monte o fluxo do seu imóvel.
          </p>
        </div>

        {/* Optional Client Name Input */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#FF600B]" />
            Nome do cliente <span className="text-[#B5B5B5] font-normal lowercase">(opcional)</span>
          </label>
          <input
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            placeholder="Ex: João da Silva"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#FF600B] text-white placeholder-[#B5B5B5]/60 text-base rounded-2xl px-4 py-3.5 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Main CTA Button */}
        <button
          type="button"
          onClick={onStartSimulation}
          className="w-full bg-[#FF600B] hover:bg-[#D94D00] text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-[#FF600B]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer group"
        >
          <Calculator className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          <span>NOVA SIMULAÇÃO</span>
          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Trust Badges */}
        <div className="mt-8 pt-5 border-t border-[#2A2A2A] flex items-center justify-center gap-2 text-xs text-[#B5B5B5] font-medium">
          <ShieldCheck className="w-4 h-4 text-[#FF600B]" />
          <span>Atendimento rápido para corretores de imóveis</span>
        </div>
      </div>
    </motion.div>
  );
};
