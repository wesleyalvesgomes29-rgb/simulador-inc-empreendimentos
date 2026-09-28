import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Search, 
  Trash2, 
  Calendar, 
  Building2
} from 'lucide-react';
import { formatBRL, copyToClipboard } from '../utils/formatters';
import { 
  ClientLead, 
  getSavedClients, 
  deleteClientLead, 
  generateCrmText, 
  exportClientsToCsv 
} from '../utils/clientStorage';

interface ClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient: (client: ClientLead) => void;
}

export const ClientsModal: React.FC<ClientsModalProps> = ({
  isOpen,
  onClose,
  onSelectClient,
}) => {
  const [clients, setClients] = useState<ClientLead[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setClients(getSavedClients());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredClients = clients.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      (c.nome || '').toLowerCase().includes(search) ||
      (c.whatsapp || '').includes(search) ||
      (c.cpf || '').includes(search) ||
      (c.imovelInfo?.nomeImovel || '').toLowerCase().includes(search)
    );
  });

  const handleCopyCrm = async (client: ClientLead, e: React.MouseEvent) => {
    e.stopPropagation();
    const crmText = generateCrmText(client);
    const success = await copyToClipboard(crmText);
    if (success) {
      setCopiedId(client.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Deseja excluir este atendimento da lista?')) {
      deleteClientLead(id);
      setClients(getSavedClients());
    }
  };

  const handleExportCsv = () => {
    exportClientsToCsv(clients);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-[#262626] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#262626] flex items-center justify-between bg-[#1A1A1A]">
          <div>
            <span className="text-[10px] font-black text-[#FF600B] uppercase tracking-widest block mb-0.5">
              PAINEL COMERCIAL • INC EMPREENDIMENTOS
            </span>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-[#FF600B]" />
              ATENDIMENTOS & PROPOSTAS ({clients.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] text-[#A3A3A3] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#2A2A2A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 border-b border-[#262626] bg-[#141414] space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, WhatsApp, CPF ou imóvel..."
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] focus:border-[#FF600B] text-white font-medium text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none placeholder:text-[#52525B]"
              />
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={clients.length === 0}
              className="flex items-center gap-1.5 text-xs font-bold bg-[#FF600B]/15 hover:bg-[#FF600B]/25 text-[#FF600B] border border-[#FF600B]/30 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              title="Exportar planilha CSV para CRM"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#FF600B]" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Clients List Area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#111111]">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 px-4">
              <User className="w-12 h-12 text-[#3F3F46] mx-auto mb-3" />
              <p className="text-[#E5E5E5] font-bold text-sm">Nenhum atendimento salvo ainda.</p>
              <p className="text-[#71717A] text-xs mt-1">
                Ao preencher a simulação e salvar a proposta, os dados do cliente aparecerão aqui.
              </p>
            </div>
          ) : (
            filteredClients.map((client) => {
              const formattedDate = new Date(client.dataCriacao).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isCopied = copiedId === client.id;

              return (
                <div
                  key={client.id}
                  onClick={() => {
                    onSelectClient(client);
                    onClose();
                  }}
                  className="bg-[#181818] border border-[#2A2A2A] hover:border-[#FF600B]/50 p-4 rounded-2xl transition-all cursor-pointer relative group shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-white text-base">
                          {client.nome || 'Cliente sem Nome'}
                        </span>
                        <span className="text-[10px] font-extrabold bg-[#FF600B]/15 text-[#FF600B] px-2 py-0.5 rounded border border-[#FF600B]/30">
                          {client.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#A3A3A3] mt-1">
                        <span className="flex items-center gap-1 font-bold text-[#FF600B]">
                          <Phone className="w-3.5 h-3.5 text-[#FF600B]" />
                          {client.whatsapp || 'Sem celular'}
                        </span>

                        <span className="flex items-center gap-1 text-[#71717A]">
                          <Calendar className="w-3.5 h-3.5 text-[#71717A]" />
                          {formattedDate}
                        </span>

                        {client.imovelInfo?.nomeImovel && (
                          <span className="flex items-center gap-1 font-bold text-white">
                            <Building2 className="w-3.5 h-3.5 text-[#FF600B]" />
                            {client.imovelInfo.nomeImovel}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-[#A3A3A3] flex flex-wrap gap-x-3 gap-y-1">
                        <span>Renda: <strong className="text-white">{formatBRL(client.renda)}</strong></span>
                        <span>•</span>
                        <span>Imóvel: <strong className="text-white">{formatBRL(client.valorImovel)}</strong></span>
                        <span>•</span>
                        <span>Entrada: <strong className="text-[#FF600B]">{formatBRL(client.valorEntradaTotal)}</strong></span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-[#2A2A2A] justify-end">
                      <button
                        type="button"
                        onClick={(e) => handleCopyCrm(client, e)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-[#FF600B] text-white border-[#FF600B]'
                            : 'bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white border-[#2A2A2A]'
                        }`}
                        title="Copiar Ficha do Cliente formatada para o CRM INC"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>COPIADO!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-[#FF600B]" />
                            <span>COPIAR CRM</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(client.id, e)}
                        className="p-2 rounded-xl bg-[#1E1E1E] hover:bg-rose-950/50 text-[#71717A] hover:text-rose-400 border border-[#2A2A2A] transition-colors cursor-pointer"
                        title="Excluir Atendimento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#262626] bg-[#1A1A1A] flex justify-between items-center text-xs text-[#A3A3A3]">
          <span>Armazenado localmente no dispositivo para atendimento INC Empreendimentos.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] font-bold text-white transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
