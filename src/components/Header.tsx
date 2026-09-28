import React from 'react';
import { Building2, RotateCcw, Table, Users, Sun, Moon } from 'lucide-react';
import { AppStep, ThemeMode } from '../types';

interface HeaderProps {
  currentStep: AppStep;
  onReset: () => void;
  onOpenTableModal?: () => void;
  onOpenClientsModal: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onReset,
  onOpenTableModal,
  onOpenClientsModal,
  theme = 'dark',
  onToggleTheme,
}) => {
  return (
    <header className="bg-[#111111] text-white border-b border-[#2A2A2A] sticky top-0 z-30 shadow-md">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand logo & title */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF600B] to-[#D94D00] flex items-center justify-center text-white shadow-md shadow-[#FF600B]/25 group-hover:scale-105 transition-transform font-black text-sm">
            INC
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white leading-none block">
              INC EMPREENDIMENTOS
            </span>
            <p className="text-xs text-[#FF600B] font-bold leading-tight mt-0.5 tracking-wider uppercase">
              SIMULADOR MCMV
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {onOpenTableModal && (
            <button
              type="button"
              onClick={onOpenTableModal}
              className="flex items-center gap-1.5 text-xs text-[#B5B5B5] hover:text-white bg-[#1A1A1A] hover:bg-[#262626] px-2.5 py-1.5 rounded-lg border border-[#2A2A2A] transition-colors cursor-pointer"
              title="Tabela de Referência MCMV"
            >
              <Table className="w-3.5 h-3.5 text-[#FF600B]" />
              <span className="hidden sm:inline">Tabela</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenClientsModal}
            className="flex items-center gap-1.5 text-xs text-[#FF600B] bg-[#FF600B]/10 hover:bg-[#FF600B]/20 px-2.5 py-1.5 rounded-lg border border-[#FF600B]/30 font-bold transition-colors cursor-pointer"
            title="Atendimentos"
          >
            <Users className="w-3.5 h-3.5 text-[#FF600B]" />
            <span>Atendimentos</span>
          </button>

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 text-xs text-[#B5B5B5] hover:text-white bg-[#1A1A1A] hover:bg-[#262626] px-2.5 py-1.5 rounded-lg border border-[#2A2A2A] transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Mudar para Modo Dia (Claro)' : 'Mudar para Modo Noite (Escuro)'}
              aria-label="Alternar Tema"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Dia</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#FF600B]" />
                  <span className="hidden sm:inline">Noite</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[#B5B5B5] hover:text-white bg-[#1A1A1A] hover:bg-[#262626] px-2.5 py-1.5 rounded-lg border border-[#2A2A2A] transition-colors cursor-pointer"
            title="Nova Simulação"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF600B]" />
            <span className="hidden sm:inline">Início</span>
          </button>
        </div>
      </div>
    </header>
  );
};
