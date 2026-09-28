import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  ChevronLeft, 
  Sliders, 
  Calculator,
  MinusCircle,
  AlertCircle,
  Building2,
  FileText,
  Wand2,
  ShieldCheck,
  Plus,
  Trash2,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { PropertyDetails, IntermediariaItem } from '../types';
import { formatBRL, parseBRLInput } from '../utils/formatters';

interface Step5IncFlowProps {
  propertyDetails: PropertyDetails;
  valorImovel: number;
  saldoEntrada: number;
  sinalAVista: number;
  setSinalAVista: (val: number) => void;
  
  // Obra / Pós-obra INC
  qtdParcelasObra: number;
  setQtdParcelasObra: (val: number) => void;
  valorParcelaObra: number;
  setValorParcelaObra: (val: number) => void;
  qtdParcelasPosObra: number;
  setQtdParcelasPosObra: (val: number) => void;
  valorParcelaPosObra: number;
  setValorParcelaPosObra: (val: number) => void;
  correcaoObra: string;
  setCorrecaoObra: (val: string) => void;
  correcaoPosObra: string;
  setCorrecaoPosObra: (val: string) => void;

  // Intermediárias / Balões INC
  intermediarias: IntermediariaItem[];
  setIntermediarias: (items: IntermediariaItem[]) => void;
  
  // Documentação
  incluirDocumentacao: boolean;
  setIncluirDocumentacao: (val: boolean) => void;
  valorDocumentacao: number;
  setValorDocumentacao: (val: number) => void;
  parcelasDocumentacao: number;
  setParcelasDocumentacao: (val: number) => void;

  onNext: () => void;
  onBack: () => void;
}

export const Step5IncFlow: React.FC<Step5IncFlowProps> = ({
  propertyDetails,
  valorImovel,
  saldoEntrada,
  sinalAVista,
  setSinalAVista,
  
  qtdParcelasObra,
  setQtdParcelasObra,
  valorParcelaObra,
  setValorParcelaObra,
  qtdParcelasPosObra,
  setQtdParcelasPosObra,
  valorParcelaPosObra,
  setValorParcelaPosObra,
  correcaoObra,
  setCorrecaoObra,
  correcaoPosObra,
  setCorrecaoPosObra,

  intermediarias,
  setIntermediarias,

  incluirDocumentacao,
  setIncluirDocumentacao,
  valorDocumentacao,
  setValorDocumentacao,
  parcelasDocumentacao,
  setParcelasDocumentacao,

  onNext,
  onBack,
}) => {
  // Structure type: 'planta' (obra + pos-obra = 74x) or 'direto' (fluxo unico de obra)
  const [tipoEstrutura, setTipoEstrutura] = useState<'planta' | 'direto'>(
    qtdParcelasPosObra > 0 ? 'planta' : 'direto'
  );

  // String state for inputs
  const [displaySinal, setDisplaySinal] = useState<string>(
    sinalAVista > 0 ? formatBRL(sinalAVista) : ''
  );
  const [displayParcelaObra, setDisplayParcelaObra] = useState<string>(
    valorParcelaObra > 0 ? formatBRL(valorParcelaObra) : ''
  );
  const [displayParcelaPosObra, setDisplayParcelaPosObra] = useState<string>(
    valorParcelaPosObra > 0 ? formatBRL(valorParcelaPosObra) : ''
  );
  const [displayDoc, setDisplayDoc] = useState<string>(
    valorDocumentacao > 0 ? formatBRL(valorDocumentacao) : ''
  );

  // 1. REGRA 23% PRÓ-SOLUTO INC & CÁLCULO ENTRADA MÍNIMA
  // Pegue o valorTotalImovel * 0.23 (teto permitido de 23%)
  const tetoPermitido = Number((valorImovel * 0.23).toFixed(2));
  const saldoDevedorTotal = saldoEntrada;

  // Calcule a diferença que sobra da entrada: saldoDevedorTotal - tetoPermitido
  const diferencaEntradaMinima = saldoDevedorTotal > tetoPermitido
    ? Number((saldoDevedorTotal - tetoPermitido).toFixed(2))
    : 0;

  // Pró-soluto a financiar (saldo abatido do sinal pago em dinheiro)
  const totalSinal = sinalAVista || 0;
  const totalIntermediarias = (intermediarias || []).reduce((acc, item) => acc + (item.valor || 0), 0);
  const proSolutoEfetivo = Math.max(0, saldoDevedorTotal - totalSinal);
  const percentualProSoluto = valorImovel > 0 ? (proSolutoEfetivo / valorImovel) * 100 : 0;
  const dentroLimite23 = proSolutoEfetivo <= tetoPermitido + 0.05;

  // 2. ELIMINAÇÃO DE RESÍDUO DE CENTAVOS NAS PARCELAS
  // Saldo restante que vai para as parcelas mensais de obra e pós-obra
  const saldoParaParcelar = Math.max(0, saldoEntrada - totalSinal - totalIntermediarias);
  const totalParcelasQtd = (qtdParcelasObra || 0) + (tipoEstrutura === 'planta' ? (qtdParcelasPosObra || 0) : 0);

  // Totais calculados
  const totalObraBase = (qtdParcelasObra || 0) * (valorParcelaObra || 0);
  const totalPosObra = tipoEstrutura === 'planta' ? (qtdParcelasPosObra || 0) * (valorParcelaPosObra || 0) : 0;
  const somaParcelasBase = totalObraBase + totalPosObra;

  // Diferença de centavos (sobra) jogada automaticamente somada na primeira parcela da obra
  const sobraCentavos = (saldoParaParcelar > 0 && somaParcelasBase > 0 && Math.abs(saldoParaParcelar - somaParcelasBase) < 2.00)
    ? Number((saldoParaParcelar - somaParcelasBase).toFixed(2))
    : 0;

  // Primeira parcela da obra com os centavos excedentes somados
  const primeiraParcelaObra = valorParcelaObra > 0 ? Number((valorParcelaObra + sobraCentavos).toFixed(2)) : 0;
  const totalObra = totalObraBase + sobraCentavos;

  const totalDistribuido = totalSinal + totalObra + totalPosObra + totalIntermediarias;
  const saldoRestante = Number((saldoEntrada - totalDistribuido).toFixed(2));

  // Função central para dividir o saldo entre as parcelas de obra e pós-obra
  const distributeRemainingEqually = (customSinal?: number) => {
    const activeSinal = customSinal !== undefined ? customSinal : totalSinal;
    const restante = Math.max(0, saldoEntrada - activeSinal - totalIntermediarias);

    if (tipoEstrutura === 'planta') {
      const tot = (qtdParcelasObra || 0) + (qtdParcelasPosObra || 0);
      if (tot > 0) {
        // Divide o valor truncando nos centavos para que a sobra seja somada na 1ª parcela da obra
        const valParc = Math.floor((restante / tot) * 100) / 100;
        setValorParcelaObra(valParc);
        setValorParcelaPosObra(valParc);
        setDisplayParcelaObra(formatBRL(valParc));
        setDisplayParcelaPosObra(formatBRL(valParc));
      }
    } else {
      const tot = qtdParcelasObra || 30;
      if (tot > 0) {
        const valParc = Math.floor((restante / tot) * 100) / 100;
        setValorParcelaObra(valParc);
        setValorParcelaPosObra(0);
        setDisplayParcelaObra(formatBRL(valParc));
        setDisplayParcelaPosObra('');
      }
    }
  };

  // Inicializa o parcelamento se ainda não houver valores definidos
  useEffect(() => {
    if (valorParcelaObra === 0 && valorParcelaPosObra === 0 && saldoEntrada > 0) {
      distributeRemainingEqually();
    }
  }, []);

  // Sincroniza inputs quando as props externas mudam
  useEffect(() => {
    setDisplaySinal(sinalAVista > 0 ? formatBRL(sinalAVista) : '');
  }, [sinalAVista]);

  useEffect(() => {
    setDisplayParcelaObra(valorParcelaObra > 0 ? formatBRL(valorParcelaObra) : '');
  }, [valorParcelaObra]);

  useEffect(() => {
    setDisplayParcelaPosObra(valorParcelaPosObra > 0 ? formatBRL(valorParcelaPosObra) : '');
  }, [valorParcelaPosObra]);

  // Handlers para Intermediárias
  const handleAddIntermediaria = () => {
    const nextNum = (intermediarias || []).length + 1;
    const defaultPeriodo = `Mês ${nextNum * 6}`;
    const newItem: IntermediariaItem = {
      id: `interm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      numero: nextNum,
      valor: 0,
      mesOuPeriodo: defaultPeriodo,
    };
    setIntermediarias([...(intermediarias || []), newItem]);
  };

  const handleSetPresetIntermediarias = (qtd: number) => {
    const items: IntermediariaItem[] = [];
    for (let i = 1; i <= qtd; i++) {
      items.push({
        id: `interm_${Date.now()}_${i}`,
        numero: i,
        valor: 0,
        mesOuPeriodo: `Mês ${i * 6}`,
      });
    }
    setIntermediarias(items);
  };

  const handleRemoveIntermediaria = (id: string) => {
    const updated = (intermediarias || [])
      .filter((it) => it.id !== id)
      .map((it, idx) => ({ ...it, numero: idx + 1 }));
    setIntermediarias(updated);
  };

  const handleIntermediariaValorChange = (id: string, rawVal: string) => {
    const num = parseBRLInput(rawVal);
    setIntermediarias(
      (intermediarias || []).map((it) => (it.id === id ? { ...it, valor: num } : it))
    );
  };

  const handleIntermediariaPeriodoChange = (id: string, periodo: string) => {
    setIntermediarias(
      (intermediarias || []).map((it) => (it.id === id ? { ...it, mesOuPeriodo: periodo } : it))
    );
  };

  // Handlers para Sinal
  const handleSinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setSinalAVista(numeric);
    setDisplaySinal(numeric > 0 ? formatBRL(numeric) : '');
  };

  const handlePresetSinal = (val: number) => {
    setSinalAVista(val);
    setDisplaySinal(val > 0 ? formatBRL(val) : '');
    distributeRemainingEqually(val);
  };

  // Ao clicar no botão de Sinal Mínimo INC, preenche o estado do Sinal automaticamente com o valor exato
  const handleSelectSinalMinimo = (val: number) => {
    setSinalAVista(val);
    setDisplaySinal(formatBRL(val));
    distributeRemainingEqually(val);
  };

  // Handlers para Obra
  const handleParcelaObraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setValorParcelaObra(numeric);
    setDisplayParcelaObra(numeric > 0 ? formatBRL(numeric) : '');
  };

  // Handlers para Pós-Obra
  const handleParcelaPosObraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setValorParcelaPosObra(numeric);
    setDisplayParcelaPosObra(numeric > 0 ? formatBRL(numeric) : '');
  };

  // Handlers para Documentação
  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseBRLInput(e.target.value);
    setValorDocumentacao(numeric);
    setDisplayDoc(numeric > 0 ? formatBRL(numeric) : '');
  };

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
              Etapa 5 de 6 • FLUXO PRÓ-SOLUTO
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#FF600B]" />
              FLUXO DE ENTRADA INC
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

        {/* 1. REGRA DE LIMITE DE 23% PRÓ-SOLUTO INC */}
        <div className={`p-4 rounded-2xl border-2 mb-5 transition-all ${
          dentroLimite23 
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-5 h-5 ${dentroLimite23 ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                <span className="text-xs font-black uppercase tracking-wider block">
                  Regra INC • Limite de 23% de Pró-Soluto
                </span>
                <span className="text-[11px] font-medium opacity-90">
                  Pró-Soluto Atual: <strong className="text-white">{formatBRL(proSolutoEfetivo)}</strong> ({percentualProSoluto.toFixed(1)}% do imóvel)
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold block opacity-75">Teto 23%</span>
              <span className="text-xs font-black text-white">{formatBRL(tetoPermitido)}</span>
            </div>
          </div>
        </div>

        {/* 2. SELEÇÃO DE ESTRUTURA DO PARCELAMENTO */}
        <div className="bg-[#1A1A1A] p-1.5 rounded-2xl border border-[#2A2A2A] mb-5 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              setTipoEstrutura('planta');
              const qO = qtdParcelasObra > 0 ? qtdParcelasObra : 30;
              const qP = qtdParcelasPosObra > 0 ? qtdParcelasPosObra : 44;
              setQtdParcelasObra(qO);
              setQtdParcelasPosObra(qP);
              const restante = Math.max(0, saldoEntrada - totalSinal - totalIntermediarias);
              const tot = qO + qP;
              if (tot > 0) {
                const valParc = Math.floor((restante / tot) * 100) / 100;
                setValorParcelaObra(valParc);
                setValorParcelaPosObra(valParc);
                setDisplayParcelaObra(formatBRL(valParc));
                setDisplayParcelaPosObra(formatBRL(valParc));
              }
            }}
            className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tipoEstrutura === 'planta'
                ? 'bg-gradient-to-r from-[#FF600B] to-[#D94D00] text-white shadow-md shadow-[#FF600B]/25'
                : 'text-[#A3A3A3] hover:text-white hover:bg-[#262626]'
            }`}
          >
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>OBRA + PÓS-OBRA (74x)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTipoEstrutura('direto');
              setQtdParcelasPosObra(0);
              setValorParcelaPosObra(0);
              setDisplayParcelaPosObra('');
              const qO = qtdParcelasObra > 0 ? qtdParcelasObra : 30;
              setQtdParcelasObra(qO);
              const restante = Math.max(0, saldoEntrada - totalSinal - totalIntermediarias);
              if (qO > 0) {
                const valParc = Math.floor((restante / qO) * 100) / 100;
                setValorParcelaObra(valParc);
                setDisplayParcelaObra(formatBRL(valParc));
              }
            }}
            className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tipoEstrutura === 'direto'
                ? 'bg-gradient-to-r from-[#FF600B] to-[#D94D00] text-white shadow-md shadow-[#FF600B]/25'
                : 'text-[#A3A3A3] hover:text-white hover:bg-[#262626]'
            }`}
          >
            <Sliders className="w-4 h-4 flex-shrink-0" />
            <span>APENAS OBRA (30x)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 3. PAINEL DE CONTROLE DO SALDO PRÓ-SOLUTO */}
          <div className="bg-[#1A1A1A] p-5 rounded-2xl border-2 border-[#FF600B]/40 shadow-md space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2.5">
              <span className="text-xs font-black text-[#FF600B] uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#FF600B]" />
                DISTRIBUIÇÃO DO SALDO DE ENTRADA
              </span>
              <span className="text-xs font-black text-white bg-[#111111] px-2.5 py-1 rounded-lg border border-[#2A2A2A]">
                Total: {formatBRL(saldoEntrada)}
              </span>
            </div>

            {/* Breakdown lines */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#A3A3A3]">
                <span className="font-semibold">Saldo total a parcelar:</span>
                <span className="font-black text-white">{formatBRL(saldoEntrada)}</span>
              </div>

              {totalSinal > 0 && (
                <div className="flex justify-between items-center text-[#FF600B]">
                  <span className="font-semibold">(-) Sinal / Ato Inicial:</span>
                  <span className="font-bold">{formatBRL(totalSinal)}</span>
                </div>
              )}

              {totalIntermediarias > 0 && (
                <div className="flex justify-between items-center text-[#FF9E00]">
                  <span className="font-semibold">(-) Intermediárias / Balões ({intermediarias.length}x):</span>
                  <span className="font-bold">{formatBRL(totalIntermediarias)}</span>
                </div>
              )}

              {totalObra > 0 && (
                <div className="flex justify-between items-center text-[#FF7A00]">
                  <span className="font-semibold">
                    (-) Durante a Obra ({qtdParcelasObra}x{sobraCentavos > 0 ? ` • 1ª de ${formatBRL(primeiraParcelaObra)}` : ''}):
                  </span>
                  <span className="font-bold">{formatBRL(totalObra)}</span>
                </div>
              )}

              {tipoEstrutura === 'planta' && totalPosObra > 0 && (
                <div className="flex justify-between items-center text-[#FF7A00]">
                  <span className="font-semibold">(-) Pós-obra / Pós-chaves ({qtdParcelasPosObra}x de {formatBRL(valorParcelaPosObra)}):</span>
                  <span className="font-bold">{formatBRL(totalPosObra)}</span>
                </div>
              )}
            </div>

            {/* Alerta caso parcelas excedam o saldo */}
            {saldoRestante < -1.00 && (
              <div className="pt-2 border-t border-[#2A2A2A]">
                <div className="bg-rose-950/40 border border-rose-500/50 text-rose-300 p-3.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <span className="text-xs font-black">
                      Parcelas excedem o saldo em {formatBRL(Math.abs(saldoRestante))}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => distributeRemainingEqually()}
                    className="text-[11px] font-bold bg-[#1A1A1A] text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/40 hover:bg-[#262626] cursor-pointer"
                  >
                    Ajustar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. SINAL / ATO INICIAL */}
          <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#2A2A2A] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <MinusCircle className="w-4 h-4 text-[#FF600B]" />
                Sinal / Ato Inicial (Entrada em Dinheiro)
              </label>
              <span className="text-[11px] text-[#71717A] font-medium">Opcional</span>
            </div>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={displaySinal}
                onChange={handleSinalChange}
                placeholder="R$ 0,00"
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#FF600B] focus:ring-1 focus:ring-[#FF600B]/30 text-white font-black text-xl rounded-2xl px-4 py-3 outline-none transition-all placeholder:text-[#52525B]"
              />
            </div>

            {/* Quick Presets for Sinal & Botão de Atalho Sinal Mínimo INC (Regra 23%) */}
            <div className="space-y-2">
              {diferencaEntradaMinima > 0 && (
                <button
                  type="button"
                  onClick={() => handleSelectSinalMinimo(diferencaEntradaMinima)}
                  className={`w-full py-2.5 px-3 rounded-xl font-black text-xs border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    Math.abs(sinalAVista - diferencaEntradaMinima) < 0.01
                      ? 'bg-[#FF600B] text-white border-[#FF600B] shadow-lg shadow-[#FF600B]/30'
                      : 'bg-[#FF600B]/15 text-[#FF600B] border-[#FF600B]/50 hover:bg-[#FF600B]/25 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-inherit flex-shrink-0" />
                  <span>Sinal Mínimo INC ({formatBRL(diferencaEntradaMinima)})</span>
                </button>
              )}

              <div className="grid grid-cols-4 gap-1.5">
                {[0, 3000, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSinal(preset)}
                    className={`text-xs py-1.5 px-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      sinalAVista === preset
                        ? 'bg-[#FF600B] text-white border-[#FF600B] shadow-md shadow-[#FF600B]/30'
                        : 'bg-[#111111] text-[#B5B5B5] border-[#2A2A2A] hover:bg-[#262626] hover:text-white'
                    }`}
                  >
                    {preset === 0 ? 'Sem Sinal' : formatBRL(preset).replace(',00', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. INTERMEDIÁRIAS / BALÕES (INC) */}
          <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#2A2A2A] space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
              <div>
                <span className="text-xs font-black text-[#FF600B] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#FF600B]" />
                  INTERMEDIÁRIAS / BALÕES (INC)
                </span>
                <span className="text-[11px] text-[#A3A3A3] font-medium block mt-0.5">
                  Parcelas anuais, semestrais ou balões intercalados
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-white bg-[#111111] px-2.5 py-1 rounded-lg border border-[#2A2A2A]">
                  {(intermediarias || []).length}x • {formatBRL(totalIntermediarias)}
                </span>
              </div>
            </div>

            {/* Quick add and preset actions */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleAddIntermediaria}
                className="py-2 px-3.5 bg-[#FF600B]/10 hover:bg-[#FF600B]/20 border border-[#FF600B]/50 text-[#FF600B] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Intermediária</span>
              </button>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((qtd) => (
                  <button
                    key={qtd}
                    type="button"
                    onClick={() => handleSetPresetIntermediarias(qtd)}
                    className="text-[11px] py-1 px-2.5 rounded-lg font-bold bg-[#111111] text-[#A3A3A3] hover:text-white hover:bg-[#262626] border border-[#2A2A2A] transition-colors cursor-pointer"
                    title={`Criar ${qtd} intermediária(s)`}
                  >
                    {qtd}x
                  </button>
                ))}
                {(intermediarias || []).length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIntermediarias([])}
                    className="text-[11px] py-1 px-2.5 rounded-lg font-bold text-rose-400 hover:bg-rose-950/30 border border-rose-900/30 transition-colors cursor-pointer"
                    title="Remover todas as intermediárias"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Intermediárias list */}
            {(!intermediarias || intermediarias.length === 0) ? (
              <div className="text-center py-4 px-3 bg-[#111111] rounded-xl border border-dashed border-[#2A2A2A] text-xs text-[#71717A]">
                Nenhuma intermediária cadastrada. Clique em <strong className="text-[#A3A3A3]">Adicionar Intermediária</strong> caso queira incluir balões semestrais ou anuais.
              </div>
            ) : (
              <div className="space-y-2.5">
                {intermediarias.map((item, index) => (
                  <div 
                    key={item.id}
                    className="bg-[#111111] p-3 rounded-xl border border-[#2A2A2A] hover:border-[#383838] transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#FF600B]/20 text-[#FF600B] text-[10px] font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        {index + 1}ª Intermediária
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIntermediaria(item.id)}
                        className="text-[#71717A] hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        title="Remover intermediária"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-[#A3A3A3] uppercase mb-1">
                          Valor da Intermediária
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={item.valor > 0 ? formatBRL(item.valor) : ''}
                          onChange={(e) => handleIntermediariaValorChange(item.id, e.target.value)}
                          placeholder="R$ 0,00"
                          className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-black text-sm rounded-xl px-3 py-2 outline-none placeholder:text-[#52525B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#A3A3A3] uppercase mb-1">
                          Mês / Período de Vencimento
                        </label>
                        <input
                          type="text"
                          value={item.mesOuPeriodo}
                          onChange={(e) => handleIntermediariaPeriodoChange(item.id, e.target.value)}
                          placeholder="Ex: Mês 12, Dez/2026, Semestral"
                          className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-semibold text-xs rounded-xl px-3 py-2 outline-none placeholder:text-[#52525B]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. PARCELAMENTO DURANTE A OBRA & PÓS-OBRA */}
          <div className="space-y-4">
            {/* Durante a Obra (INCC) */}
            <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#2A2A2A] space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
                <span className="text-xs font-black text-[#FF600B] uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#FF600B]" />
                  DURANTE A OBRA (INCC)
                </span>
                <span className="text-xs font-bold text-[#A3A3A3]">
                  Total: {formatBRL(totalObra)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#A3A3A3] uppercase mb-1">
                    Quantidade de Parcelas
                  </label>
                  <div className="flex items-center gap-1.5 bg-[#111111] border border-[#2E2E2E] px-3 py-2 rounded-xl focus-within:border-[#FF600B]">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={qtdParcelasObra || ''}
                      onChange={(e) => setQtdParcelasObra(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full bg-transparent font-black text-white text-sm outline-none"
                    />
                    <span className="text-xs font-bold text-[#71717A]">x</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A3A3A3] uppercase mb-1">
                    Valor da Parcela Mensal
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={displayParcelaObra}
                    onChange={handleParcelaObraChange}
                    placeholder="R$ 0,00"
                    className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-black text-sm rounded-xl px-3 py-2 outline-none placeholder:text-[#52525B]"
                  />
                </div>
              </div>

              {sobraCentavos > 0 && (
                <div className="bg-[#111111] px-3 py-2 rounded-xl border border-[#2A2A2A] text-xs flex items-center justify-between text-[#A3A3A3]">
                  <span>1ª parcela com ajuste de centavos:</span>
                  <strong className="text-white font-black">{formatBRL(primeiraParcelaObra)}</strong>
                </div>
              )}

              <div className="flex items-center justify-between bg-[#111111] p-2.5 rounded-xl border border-[#2A2A2A] text-xs">
                <span className="text-[#A3A3A3] font-medium">Correção monetária durante a obra:</span>
                <span className="font-bold text-[#FF600B]">{correcaoObra || 'INCC'}</span>
              </div>
            </div>

            {/* Pós-Obra / Pós-Chaves (IPCA + 1,99% a.a.) */}
            {tipoEstrutura === 'planta' && (
              <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#2A2A2A] space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
                  <span className="text-xs font-black text-[#FF7A00] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FF7A00]" />
                    PÓS-CHAVES / PÓS-OBRA (INC)
                  </span>
                  <span className="text-xs font-bold text-[#A3A3A3]">
                    Total: {formatBRL(totalPosObra)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#A3A3A3] uppercase mb-1">
                      Quantidade de Parcelas
                    </label>
                    <div className="flex items-center gap-1.5 bg-[#111111] border border-[#2E2E2E] px-3 py-2 rounded-xl focus-within:border-[#FF600B]">
                      <input
                        type="number"
                        min="1"
                        max="80"
                        value={qtdParcelasPosObra || ''}
                        onChange={(e) => setQtdParcelasPosObra(Math.max(1, Number(e.target.value) || 1))}
                        className="w-full bg-transparent font-black text-white text-sm outline-none"
                      />
                      <span className="text-xs font-bold text-[#71717A]">x</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#A3A3A3] uppercase mb-1">
                      Valor da Parcela Mensal
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={displayParcelaPosObra}
                      onChange={handleParcelaPosObraChange}
                      placeholder="R$ 0,00"
                      className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-black text-sm rounded-xl px-3 py-2 outline-none placeholder:text-[#52525B]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#111111] p-2.5 rounded-xl border border-[#2A2A2A] text-xs">
                  <span className="text-[#A3A3A3] font-medium">Correção monetária pós-chaves:</span>
                  <span className="font-bold text-[#FF7A00]">{correcaoPosObra || 'IPCA + 1,99% a.a.'}</span>
                </div>
              </div>
            )}
          </div>

          {/* 7. DOCUMENTAÇÃO (ITBI + REGISTRO) */}
          <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#2A2A2A] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incluirDocumentacao}
                  onChange={(e) => setIncluirDocumentacao(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FF600B] focus:ring-[#FF600B] accent-[#FF600B]"
                />
                <FileText className="w-4 h-4 text-[#FF600B]" />
                Incluir Documentação (ITBI + Registro)
              </label>
              <span className="text-[11px] text-[#FF600B] font-bold">
                {incluirDocumentacao ? 'Incluso na Proposta' : 'Não incluso'}
              </span>
            </div>

            {incluirDocumentacao && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#A3A3A3] uppercase mb-1">
                    Valor Estimado
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={displayDoc}
                    onChange={handleDocChange}
                    placeholder="R$ 6.800,00"
                    className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-bold text-xs rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#A3A3A3] uppercase mb-1">
                    Parcelamento
                  </label>
                  <select
                    value={parcelasDocumentacao}
                    onChange={(e) => setParcelasDocumentacao(Number(e.target.value))}
                    className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-bold text-xs rounded-xl px-3 py-2 outline-none"
                  >
                    {[1, 6, 12, 24, 36].map((p) => (
                      <option key={p} value={p}>
                        {p === 1 ? 'À vista' : `Até ${p}x`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF600B] to-[#D94D00] hover:opacity-95 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-[#FF600B]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>GERAR PROPOSTA COMERCIAL INC</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
