import React, { useState } from 'react';
import { X, Table, Search, RotateCcw } from 'lucide-react';
import { McmvBracket } from '../types';
import { formatBRL, formatPercent } from '../utils/formatters';

interface TableDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  mcmvData: McmvBracket[];
  setMcmvData: React.Dispatch<React.SetStateAction<McmvBracket[]>>;
  onResetData: () => void;
}

export const TableDataModal: React.FC<TableDataModalProps> = ({
  isOpen,
  onClose,
  mcmvData,
  onResetData,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filteredMcmv = mcmvData.filter((b) => {
    const q = searchTerm.toLowerCase();
    return (
      b.faixa.toLowerCase().includes(q) ||
      b.minRenda.toString().includes(q) ||
      b.maxRenda.toString().includes(q) ||
      (b.obs && b.obs.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#141414] border border-[#262626] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#1A1A1A] px-5 py-4 border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF600B]/10 flex items-center justify-center text-[#FF600B] border border-[#FF600B]/20 font-black text-sm">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                TABELA MCMV ASSOCIATIVO • UBERLÂNDIA/MG
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Faixas de Renda, Financiamento CAIXA, Subsídios e Taxas de Juros 2026
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#A3A3A3] hover:text-white bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-xl transition-colors cursor-pointer border border-[#2A2A2A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Actions */}
        <div className="bg-[#141414] px-5 py-3 border-b border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por faixa, valor de renda..."
              className="w-full bg-[#1A1A1A] border border-[#2E2E2E] text-xs text-white placeholder-[#71717A] rounded-xl pl-9 pr-3 py-2 outline-none focus:border-[#FF600B]"
            />
          </div>

          <button
            type="button"
            onClick={onResetData}
            className="text-xs text-[#FF600B] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar Tabela Padrão
          </button>
        </div>

        {/* Modal Body Table Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="overflow-x-auto border border-[#262626] rounded-2xl bg-[#1A1A1A]">
            <table className="w-full text-left text-xs text-[#E5E5E5]">
              <thead className="bg-[#111111] text-[#FF600B] uppercase text-[10px] font-bold border-b border-[#262626]">
                <tr>
                  <th className="p-3">Faixa</th>
                  <th className="p-3">Faixa de Renda</th>
                  <th className="p-3">Perfil</th>
                  <th className="p-3">Financ. Estimado</th>
                  <th className="p-3">Subsídio Máx</th>
                  <th className="p-3">Parcela Estimada</th>
                  <th className="p-3">Taxa Juros</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] font-medium bg-[#141414]">
                {filteredMcmv.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1A1A1A]">
                    <td className="p-3">
                      <span className="bg-[#1E1E1E] px-2 py-0.5 rounded border border-[#2E2E2E] text-white font-bold">
                        {item.faixa}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-white">
                      R$ {item.minRenda.toLocaleString('pt-BR')} - R$ {item.maxRenda.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.isCotista ? 'bg-[#FF600B]/15 text-[#FF600B] border border-[#FF600B]/30' : 'bg-[#1E1E1E] text-[#A3A3A3] border border-[#2A2A2A]'
                      }`}>
                        {item.isCotista ? 'Cotista' : 'Não Cot.'} | {item.temDependente ? 'c/ Dep' : 's/ Dep'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-white">
                      {formatBRL(item.financiamentoMax)}
                    </td>
                    <td className="p-3 font-bold text-[#FF600B]">
                      {formatBRL(item.subsidioMax)}
                    </td>
                    <td className="p-3 text-white font-bold">
                      {formatBRL(item.parcelaEstimada)}
                    </td>
                    <td className="p-3 text-[#FF7A00] font-semibold">
                      {formatPercent(item.taxaJurosAnual)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#1A1A1A] px-5 py-3 border-t border-[#262626] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gradient-to-r from-[#FF600B] to-[#D94D00] hover:opacity-95 text-white font-black text-xs py-2.5 px-5 rounded-xl cursor-pointer shadow-md shadow-[#FF600B]/20"
          >
            FECHAR TABELA
          </button>
        </div>
      </div>
    </div>
  );
};
