import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, Building2, MapPin, Layers, DollarSign, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PropertyDetails } from '../types';
import { INC_EMPREENDIMENTOS, EMPREENDIMENTO_PADRAO_INC, IncTipologia } from '../data/incEmpreendimentos';
import { formatBRL, parseBRLInput } from '../utils/formatters';

interface Step3EscolhaImovelProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: React.Dispatch<React.SetStateAction<PropertyDetails>>;
  valorImovel: number;
  setValorImovel: (val: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3EscolhaImovel: React.FC<Step3EscolhaImovelProps> = ({
  propertyDetails,
  setPropertyDetails,
  valorImovel,
  setValorImovel,
  onNext,
  onBack,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(
    propertyDetails.empreendimentoId || INC_EMPREENDIMENTOS[0]?.id || 'park-jardim-do-sol'
  );

  const empreendimento =
    INC_EMPREENDIMENTOS.find((e) => e.id === selectedEmpId) ||
    INC_EMPREENDIMENTOS[0] ||
    EMPREENDIMENTO_PADRAO_INC;

  const [displayValor, setDisplayValor] = useState<string>(
    valorImovel > 0 ? formatBRL(valorImovel) : ''
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSelectEmpreendimento = (emp: typeof INC_EMPREENDIMENTOS[0]) => {
    setSelectedEmpId(emp.id);
    const tipo = emp.tipologias[0];
    if (tipo) {
      setValorImovel(tipo.valorPadrao);
      setDisplayValor(formatBRL(tipo.valorPadrao));
      setPropertyDetails(prev => ({
        ...prev,
        empreendimentoId: emp.id,
        nomeImovel: emp.nome,
        construtora: 'INC Empreendimentos',
        localizacao: `${emp.bairro}, ${emp.cidade} - ${emp.estado}`,
        tipologia: `${tipo.nome} (${tipo.areaM2} m²)`,
        areaM2: tipo.areaM2,
        valorImovel: tipo.valorPadrao,
      }));
    } else {
      setPropertyDetails(prev => ({
        ...prev,
        empreendimentoId: emp.id,
        nomeImovel: emp.nome,
        construtora: 'INC Empreendimentos',
        localizacao: `${emp.bairro}, ${emp.cidade} - ${emp.estado}`,
      }));
    }
    setErrorMsg('');
  };

  const handleSelectTipologia = (tipo: IncTipologia) => {
    setValorImovel(tipo.valorPadrao);
    setDisplayValor(formatBRL(tipo.valorPadrao));
    setPropertyDetails(prev => ({
      ...prev,
      empreendimentoId: empreendimento.id,
      nomeImovel: empreendimento.nome,
      construtora: 'INC Empreendimentos',
      localizacao: `${empreendimento.bairro}, ${empreendimento.cidade} - ${empreendimento.estado}`,
      tipologia: `${tipo.nome} (${tipo.areaM2} m²)`,
      areaM2: tipo.areaM2,
      valorImovel: tipo.valorPadrao,
    }));
    setErrorMsg('');
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setValorImovel(numeric);
    setDisplayValor(numeric > 0 ? formatBRL(numeric) : '');
    setPropertyDetails(prev => ({ ...prev, valorImovel: numeric }));
    if (numeric > 0) setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valorImovel <= 0) {
      setErrorMsg('Por favor, selecione uma tipologia ou informe o valor do imóvel.');
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
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#262626]">
          <div>
            <span className="text-xs font-bold text-[#FF600B] uppercase tracking-wider block mb-1">
              Etapa 3 de 6 • EMPREENDIMENTO INC
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#FF600B]" />
              ESCOLHA DO IMÓVEL INC
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

        {/* Seleção de Empreendimento INC */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#FF600B]" />
            Selecione o Empreendimento INC:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {INC_EMPREENDIMENTOS.map((emp) => {
              const isSelected = emp.id === empreendimento.id;
              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handleSelectEmpreendimento(emp)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF600B]/15 border-[#FF600B] shadow-md shadow-[#FF600B]/20'
                      : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#3A3A3A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white">{emp.nome}</span>
                    {isSelected && (
                      <span className="text-[10px] bg-[#FF600B] text-white px-2 py-0.5 rounded font-extrabold uppercase">
                        Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#A3A3A3] mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FF600B]" />
                    {emp.bairro} • {emp.cidade}/{emp.estado}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empreendimento Card Header */}
        <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#2A2A2A] mb-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-[#FF600B]/15 text-[#FF600B] px-2.5 py-0.5 rounded-md border border-[#FF600B]/30 uppercase">
                  {empreendimento.id === 'park-jardim-do-sol' ? 'LANÇAMENTO OFICIAL' : 'EMPREENDIMENTO INC'}
                </span>
                <span className="text-xs text-[#71717A]">• {empreendimento.cidade}/{empreendimento.estado}</span>
              </div>
              <h3 className="text-lg font-black text-white mt-1.5">{empreendimento.nome}</h3>
              <p className="text-xs text-[#A3A3A3] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF600B]" />
                {empreendimento.bairro}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#71717A] block font-semibold uppercase">Entrega Prevista</span>
              <span className="text-xs font-black text-white">{empreendimento.previsaoEntrega}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-rose-950/50 border border-rose-600/50 text-rose-300 px-4 py-2.5 rounded-2xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* 1. SELEÇÃO DE TIPOLOGIAS INC */}
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#FF600B]" />
                Selecione a Planta / Tipologia:
              </span>
              <span className="text-[11px] text-[#A3A3A3]">Clique para preencher</span>
            </label>

            <div className="space-y-2.5">
              {empreendimento.tipologias.map((tipo) => {
                const isSelected = valorImovel === tipo.valorPadrao || propertyDetails.tipologia.includes(tipo.nome);

                return (
                  <div
                    key={tipo.id}
                    onClick={() => handleSelectTipologia(tipo)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FF600B]/10 border-[#FF600B] shadow-md shadow-[#FF600B]/20'
                        : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#3A3A3A]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{tipo.nome}</span>
                        {tipo.destaque && (
                          <span className="text-[10px] bg-[#FF600B] text-white px-2 py-0.2 rounded font-extrabold">
                            MAIS PROCURADO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#A3A3A3] mt-0.5">{tipo.descricao}</p>
                    </div>

                    <div className="text-right flex-shrink-0 ml-3">
                      <span className="text-[10px] text-[#71717A] block font-medium">A partir de</span>
                      <strong className={`text-base font-black ${isSelected ? 'text-[#FF600B]' : 'text-white'}`}>
                        {formatBRL(tipo.valorPadrao)}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. VALOR DO IMÓVEL (EDITÁVEL) */}
          <div className="bg-gradient-to-br from-[#FF600B]/15 via-[#1A1A1A] to-[#141414] p-5 rounded-2xl border-2 border-[#FF600B] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-[#FF600B] uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#FF600B]" />
                VALOR DO IMÓVEL / UNIDADE (R$)
              </label>
              <span className="text-[10px] text-[#FF600B] font-extrabold uppercase bg-[#FF600B]/15 px-2 py-0.5 rounded border border-[#FF600B]/30">
                Obrigatório
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                required
                value={displayValor}
                onChange={handleValorChange}
                placeholder="R$ 0,00"
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#FF600B] focus:ring-1 focus:ring-[#FF600B]/30 text-white font-black text-2xl md:text-3xl rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>
          </div>

          {/* 3. DADOS ESPECÍFICOS DA UNIDADE */}
          <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#2A2A2A] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#E5E5E5] uppercase tracking-wider mb-1">
                Unidade / Bloco / Andar
              </label>
              <input
                type="text"
                value={propertyDetails.unidade || ''}
                onChange={(e) => setPropertyDetails(prev => ({ ...prev, unidade: e.target.value }))}
                placeholder="Ex: Apto 204 - Bloco 02"
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-medium text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E5E5E5] uppercase tracking-wider mb-1">
                Tipologia / Detalhe
              </label>
              <input
                type="text"
                value={propertyDetails.tipologia || ''}
                onChange={(e) => setPropertyDetails(prev => ({ ...prev, tipologia: e.target.value }))}
                placeholder="Ex: 2 Quartos (41,20 m²)"
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-medium text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={valorImovel <= 0}
            className="w-full mt-2 bg-gradient-to-r from-[#FF600B] to-[#D94D00] hover:opacity-95 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-[#FF600B]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>AVANÇAR PARA VALORES DA OPERAÇÃO</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
