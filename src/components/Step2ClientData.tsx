import React, { useState } from 'react';
import { ArrowRight, DollarSign, Users, Briefcase, ChevronLeft, User, Phone, Mail, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { formatBRL, parseBRLInput, formatPhoneMask, formatCpfMask } from '../utils/formatters';

interface Step2ClientDataProps {
  nomeCliente: string;
  setNomeCliente: (val: string) => void;
  whatsapp: string;
  setWhatsapp: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  cpf: string;
  setCpf: (val: string) => void;
  income: number;
  setIncome: (val: number) => void;
  temDependente: boolean;
  setTemDependente: (val: boolean) => void;
  isCotista: boolean;
  setIsCotista: (val: boolean) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const Step2ClientData: React.FC<Step2ClientDataProps> = ({
  nomeCliente,
  setNomeCliente,
  whatsapp,
  setWhatsapp,
  email,
  setEmail,
  cpf,
  setCpf,
  income,
  setIncome,
  temDependente,
  setTemDependente,
  isCotista,
  setIsCotista,
  onNext,
  onBack,
}) => {
  const [displayIncome, setDisplayIncome] = useState<string>(
    income > 0 ? formatBRL(income) : ''
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const numericVal = parseBRLInput(rawVal);
    setIncome(numericVal);
    setDisplayIncome(numericVal > 0 ? formatBRL(numericVal) : '');
    if (numericVal >= 1400) {
      setErrorMsg('');
    }
  };

  const handlePresetIncome = (val: number) => {
    setIncome(val);
    setDisplayIncome(formatBRL(val));
    setErrorMsg('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatPhoneMask(e.target.value);
    setWhatsapp(masked);
    if (errorMsg) setErrorMsg('');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatCpfMask(e.target.value);
    setCpf(masked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomeCliente.trim()) {
      setErrorMsg('Por favor, informe o Nome do cliente.');
      return;
    }

    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe um WhatsApp/Telefone válido com DDD.');
      return;
    }

    if (income < 1400) {
      setErrorMsg('Informe uma renda mínima válida a partir de R$ 1.400,00.');
      return;
    }

    setErrorMsg('');
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
              Etapa 1 de 6 • INC EMPREENDIMENTOS
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              DADOS DO CLIENTE
            </h2>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-semibold text-[#A3A3A3] hover:text-white bg-[#1E1E1E] hover:bg-[#2A2A2A] px-3 py-2 rounded-xl transition-colors cursor-pointer border border-[#2A2A2A]"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-rose-950/50 border border-rose-600/50 text-rose-300 px-4 py-2.5 rounded-2xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Nome e WhatsApp (Obrigatórios) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Nome do Cliente */}
            <div>
              <label className="block text-xs font-bold text-[#E5E5E5] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#FF600B]" />
                  Nome do Cliente
                </span>
                <span className="text-[10px] text-[#FF600B] font-extrabold uppercase">
                  Obrigatório
                </span>
              </label>
              <input
                type="text"
                required
                value={nomeCliente}
                onChange={(e) => {
                  setNomeCliente(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Ex: João Silva"
                className="w-full bg-[#1E1E1E] border border-[#2E2E2E] focus:border-[#FF600B] focus:ring-1 focus:ring-[#FF600B]/30 text-white font-bold text-sm rounded-2xl px-4 py-3 outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>

            {/* 2. WhatsApp / Telefone */}
            <div>
              <label className="block text-xs font-bold text-[#E5E5E5] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#FF600B]" />
                  WhatsApp / Celular
                </span>
                <span className="text-[10px] text-[#FF600B] font-extrabold uppercase">
                  Obrigatório
                </span>
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={handlePhoneChange}
                placeholder="(34) 99999-9999"
                className="w-full bg-[#1E1E1E] border border-[#2E2E2E] focus:border-[#FF600B] focus:ring-1 focus:ring-[#FF600B]/30 text-white font-bold text-sm rounded-2xl px-4 py-3 outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>
          </div>

          {/* E-mail e CPF (Opcionais) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 3. E-mail */}
            <div>
              <label className="block text-xs font-bold text-[#E5E5E5] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#A3A3A3]" />
                  E-mail
                </span>
                <span className="text-[10px] text-[#71717A] font-normal lowercase">
                  (opcional)
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="w-full bg-[#1E1E1E] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-medium text-sm rounded-2xl px-4 py-2.5 outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>

            {/* 4. CPF */}
            <div>
              <label className="block text-xs font-bold text-[#E5E5E5] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#A3A3A3]" />
                  CPF do Cliente
                </span>
                <span className="text-[10px] text-[#71717A] font-normal lowercase">
                  (opcional)
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                className="w-full bg-[#1E1E1E] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-medium text-sm rounded-2xl px-4 py-2.5 outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#262626] my-1 pt-3">
            <span className="text-[11px] font-black text-[#FF600B] uppercase tracking-wider block mb-3">
              DADOS PARA ENQUADRAMENTO MCMV 2026
            </span>
          </div>

          {/* 5. Renda Mensal */}
          <div>
            <label className="block text-xs font-bold text-[#E5E5E5] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#FF600B]" />
                Renda Familiar Bruta Mensal
              </span>
              <span className="text-[11px] text-[#A3A3A3] font-normal lowercase">
                (Ex: R$ 3.200,00)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={displayIncome}
                onChange={handleIncomeChange}
                placeholder="R$ 0,00"
                className="w-full bg-[#1E1E1E] border-2 border-[#2E2E2E] focus:border-[#FF600B] focus:ring-2 focus:ring-[#FF600B]/20 text-white font-black text-2xl rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>

            {/* Quick Presets */}
            <div className="mt-3">
              <span className="text-[11px] text-[#A3A3A3] font-medium block mb-1.5">
                Atalhos rápidos de renda:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[2200, 2800, 3500, 4800].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetIncome(preset)}
                    className={`text-xs py-1.5 px-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      income === preset
                        ? 'bg-[#FF600B] text-white border-[#FF600B] shadow-md shadow-[#FF600B]/30'
                        : 'bg-[#1E1E1E] text-[#B5B5B5] border-[#2A2A2A] hover:bg-[#262626] hover:text-white'
                    }`}
                  >
                    {formatBRL(preset).replace(',00', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Possui dependente? */}
          <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#2A2A2A]">
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FF600B]" />
              Possui dependente?
            </label>
            <p className="text-xs text-[#A3A3A3] mb-3">
              Filho(a), cônjuge ou familiar comprovado como dependente financeiro.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTemDependente(true)}
                className={`py-3 px-4 rounded-xl font-black text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  temDependente
                    ? 'bg-gradient-to-r from-[#FF600B] to-[#D94D00] text-white border-transparent shadow-md shadow-[#FF600B]/30'
                    : 'bg-[#1E1E1E] text-[#A3A3A3] border-[#2A2A2A] hover:bg-[#262626] hover:text-white'
                }`}
              >
                SIM
              </button>
              <button
                type="button"
                onClick={() => setTemDependente(false)}
                className={`py-3 px-4 rounded-xl font-black text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !temDependente
                    ? 'bg-gradient-to-r from-[#FF600B] to-[#D94D00] text-white border-transparent shadow-md shadow-[#FF600B]/30'
                    : 'bg-[#1E1E1E] text-[#A3A3A3] border-[#2A2A2A] hover:bg-[#262626] hover:text-white'
                }`}
              >
                NÃO
              </button>
            </div>
          </div>

          {/* 7. Possui mais de 36 meses de contribuição ao FGTS? */}
          <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#2A2A2A]">
            <div className="flex items-start justify-between mb-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#FF600B]" />
                Mais de 36 meses no FGTS?
              </label>
              <span className="text-[10px] bg-[#FF600B]/15 text-[#FF600B] px-2 py-0.5 rounded font-bold uppercase border border-[#FF600B]/30">
                {isCotista ? 'COTISTA' : 'NÃO COTISTA'}
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] mb-3">
              Possui 3 anos ou mais de carteira assinada (soma de todos os contratos CLT)?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsCotista(true)}
                className={`py-3 px-4 rounded-xl font-black text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isCotista
                    ? 'bg-gradient-to-r from-[#FF600B] to-[#D94D00] text-white border-transparent shadow-md shadow-[#FF600B]/30'
                    : 'bg-[#1E1E1E] text-[#A3A3A3] border-[#2A2A2A] hover:bg-[#262626] hover:text-white'
                }`}
              >
                <span>SIM</span>
                <span className="text-[10px] opacity-90">(COTISTA)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCotista(false)}
                className={`py-3 px-4 rounded-xl font-black text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isCotista
                    ? 'bg-gradient-to-r from-[#FF600B] to-[#D94D00] text-white border-transparent shadow-md shadow-[#FF600B]/30'
                    : 'bg-[#1E1E1E] text-[#A3A3A3] border-[#2A2A2A] hover:bg-[#262626] hover:text-white'
                }`}
              >
                <span>NÃO</span>
                <span className="text-[10px] opacity-90">(NÃO COTISTA)</span>
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF600B] to-[#D94D00] hover:opacity-95 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-[#FF600B]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>CONSULTAR TABELA MCMV</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
