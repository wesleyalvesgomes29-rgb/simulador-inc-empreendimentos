import React from 'react';
import { AppStep } from '../types';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: AppStep;
  onNavigateToStep?: (step: AppStep) => void;
}

const STEPS: { id: AppStep; number: number; label: string }[] = [
  { id: 'dados_cliente', number: 1, label: 'Cliente' },
  { id: 'resultado_mcmv', number: 2, label: 'MCMV' },
  { id: 'escolha_imovel', number: 3, label: 'Imóvel INC' },
  { id: 'valores_cliente', number: 4, label: 'Valores' },
  { id: 'fluxo_construtora', number: 5, label: 'Pró-Soluto' },
  { id: 'resumo_final', number: 6, label: 'Proposta' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onNavigateToStep }) => {
  const getStepIndex = (step: AppStep): number => {
    switch (step) {
      case 'dados_cliente': return 1;
      case 'resultado_mcmv': return 2;
      case 'escolha_imovel': return 3;
      case 'valores_cliente': return 4;
      case 'fluxo_construtora': return 5;
      case 'resumo_final': return 6;
      default: return 1;
    }
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="bg-[#111111]/95 backdrop-blur-md border-b border-[#262626] py-2.5 px-4 sticky top-[57px] z-20 shadow-md">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {STEPS.map((step) => {
          const isDone = step.number < currentIndex;
          const isCurrent = step.number === currentIndex;

          return (
            <div
              key={step.id}
              onClick={() => {
                if (isDone && onNavigateToStep) {
                  onNavigateToStep(step.id);
                }
              }}
              className={`flex flex-col items-center gap-1 flex-1 relative ${
                isDone ? 'cursor-pointer hover:opacity-80' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-[#FF600B]/20 text-[#FF600B] border border-[#FF600B]/50 font-extrabold shadow-sm'
                    : isCurrent
                    ? 'bg-gradient-to-r from-[#FF600B] to-[#D94D00] text-white ring-2 ring-[#FF600B]/40 ring-offset-2 ring-offset-[#111111] shadow-md'
                    : 'bg-[#1E1E1E] text-[#71717A] border border-[#2A2A2A]'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight truncate max-w-[65px] text-center ${
                  isCurrent
                    ? 'text-[#FF600B] font-bold'
                    : isDone
                    ? 'text-[#E5E5E5]'
                    : 'text-[#71717A]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
