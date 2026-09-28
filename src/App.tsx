/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  AppStep, 
  McmvBracket, 
  McmvSimulationResult, 
  PropertyDetails,
  IntermediariaItem,
  ThemeMode
} from './types';
import { INITIAL_MCMV_DATA, lookupMcmvTable } from './data/mcmvData';
import { EMPREENDIMENTO_PADRAO_INC, INC_EMPREENDIMENTOS } from './data/incEmpreendimentos';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { Step2ClientData } from './components/Step2ClientData';
import { Step3McmvResult } from './components/Step3McmvResult';
import { Step3EscolhaImovel } from './components/Step3EscolhaImovel';
import { Step4ValoresCliente } from './components/Step4ValoresCliente';
import { Step5IncFlow } from './components/Step5IncFlow';
import { Step6Summary } from './components/Step6Summary';
import { TableDataModal } from './components/TableDataModal';
import { ClientsModal } from './components/ClientsModal';
import { saveClientLead, ClientLead } from './utils/clientStorage';

export default function App() {
  // Theme Mode (dark / light)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('inc_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
    localStorage.setItem('inc_theme_mode', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation Step - Start directly on Screen 1 (Cliente)
  const [currentStep, setCurrentStep] = useState<AppStep>('dados_cliente');

  // Customer Data
  const [nomeCliente, setNomeCliente] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [income, setIncome] = useState<number>(3200);
  const [temDependente, setTemDependente] = useState<boolean>(true);
  const [isCotista, setIsCotista] = useState<boolean>(true);
  const [currentLeadId, setCurrentLeadId] = useState<string | undefined>(undefined);

  // MCMV Dataset
  const [mcmvData, setMcmvData] = useState<McmvBracket[]>(INITIAL_MCMV_DATA);

  // Property Details (INC Empreendimentos default)
  const defaultEmp = INC_EMPREENDIMENTOS[0] || EMPREENDIMENTO_PADRAO_INC;
  const defaultTipo = defaultEmp.tipologias[0];

  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    empreendimentoId: defaultEmp.id,
    nomeImovel: defaultEmp.nome,
    construtora: 'INC Empreendimentos',
    localizacao: `${defaultEmp.bairro}, ${defaultEmp.cidade} - ${defaultEmp.estado}`,
    unidade: 'Apto 204 - Bloco 02',
    tipologia: `${defaultTipo.nome} (${defaultTipo.areaM2} m²)`,
    areaM2: defaultTipo.areaM2,
    valorImovel: defaultTipo.valorPadrao,
  });
  const [valorImovel, setValorImovel] = useState<number>(defaultTipo.valorPadrao);

  // CAIXA, Subsídio & FGTS Values
  const [financiamentoCaixa, setFinanciamentoCaixa] = useState<number>(184000);
  const [subsidioCaixa, setSubsidioCaixa] = useState<number>(32500);
  const [fgts, setFgts] = useState<number>(0);
  const [sinalAVista, setSinalAVista] = useState<number>(0);

  // INC Developer Flow Configuration (30x Obra + 44x Pós-Obra)
  const [qtdParcelasObra, setQtdParcelasObra] = useState<number>(30);
  const [valorParcelaObra, setValorParcelaObra] = useState<number>(0);
  const [qtdParcelasPosObra, setQtdParcelasPosObra] = useState<number>(44);
  const [valorParcelaPosObra, setValorParcelaPosObra] = useState<number>(0);
  const [correcaoObra, setCorrecaoObra] = useState<string>('INCC');
  const [correcaoPosObra, setCorrecaoPosObra] = useState<string>('IPCA + 1,99% a.a.');
  const [intermediarias, setIntermediarias] = useState<IntermediariaItem[]>([]);

  // Documentação (ITBI + Registro)
  const [incluirDocumentacao, setIncluirDocumentacao] = useState<boolean>(false);
  const [valorDocumentacao, setValorDocumentacao] = useState<number>(6800);
  const [parcelasDocumentacao, setParcelasDocumentacao] = useState<number>(36);

  // Modals
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [isClientsModalOpen, setIsClientsModalOpen] = useState<boolean>(false);

  // Calculate MCMV simulation result dynamically
  const simulationResult: McmvSimulationResult = lookupMcmvTable(
    income,
    temDependente,
    isCotista,
    mcmvData
  );

  // Real Operation Balance (Saldo Entrada / Pró-Soluto = Valor Imóvel - Financiamento CAIXA - Subsídio MCMV - FGTS)
  const saldoEntrada = Math.max(
    0,
    valorImovel - financiamentoCaixa - subsidioCaixa - fgts
  );
  const percentualProSoluto = valorImovel > 0 ? (saldoEntrada / valorImovel) * 100 : 0;

  // Helper to persist/sync active simulation state to local storage for the broker
  const autoSaveLead = (statusStr: 'Em Atendimento' | 'Proposta Gerada' = 'Em Atendimento') => {
    if (!nomeCliente.trim()) return;

    const lead = saveClientLead({
      id: currentLeadId,
      nome: nomeCliente,
      whatsapp,
      email,
      cpf,
      renda: income,
      temDependente,
      isCotista,
      imovelInfo: propertyDetails,
      valorImovel,
      financiamentoCaixa,
      subsidioCaixa,
      fgts,
      sinalAVista,
      valorEntradaTotal: saldoEntrada,
      percentualProSoluto,
      intermediarias: intermediarias.length > 0 ? intermediarias : undefined,
      qtdParcelasObra,
      valorParcelaObra,
      qtdParcelasPosObra,
      valorParcelaPosObra,
      status: statusStr,
    });

    if (lead && lead.id) {
      setCurrentLeadId(lead.id);
    }
  };

  // Sync MCMV lookup to CAIXA financing & subsidy fields when moving from Step 1 to Step 2
  const handleCalculateMcmv = () => {
    const res = lookupMcmvTable(income, temDependente, isCotista, mcmvData);
    setFinanciamentoCaixa(res.financiamento);
    setSubsidioCaixa(res.subsidio);
    autoSaveLead('Em Atendimento');
    setCurrentStep('resultado_mcmv');
  };

  // Load a saved client into state
  const handleSelectSavedClient = (client: ClientLead) => {
    setCurrentLeadId(client.id);
    setNomeCliente(client.nome);
    setWhatsapp(client.whatsapp || '');
    setEmail(client.email || '');
    setCpf(client.cpf || '');
    setIncome(client.renda);
    setTemDependente(client.temDependente);
    setIsCotista(client.isCotista);
    if (client.imovelInfo) {
      setPropertyDetails(client.imovelInfo);
      setValorImovel(client.imovelInfo.valorImovel || client.valorImovel);
    } else {
      setValorImovel(client.valorImovel);
    }
    setFinanciamentoCaixa(client.financiamentoCaixa);
    setSubsidioCaixa(client.subsidioCaixa);
    setFgts(client.fgts);
    setSinalAVista(client.sinalAVista);
    setIntermediarias(client.intermediarias || []);
    if (client.qtdParcelasObra) setQtdParcelasObra(client.qtdParcelasObra);
    if (client.valorParcelaObra) setValorParcelaObra(client.valorParcelaObra);
    if (client.qtdParcelasPosObra) setQtdParcelasPosObra(client.qtdParcelasPosObra);
    if (client.valorParcelaPosObra) setValorParcelaPosObra(client.valorParcelaPosObra);

    if (client.status === 'Proposta Gerada') {
      setCurrentStep('resumo_final');
    } else {
      setCurrentStep('dados_cliente');
    }
  };

  // Reset function to restart simulation with INC defaults
  const handleReset = () => {
    setCurrentStep('dados_cliente');
    setCurrentLeadId(undefined);
    setNomeCliente('');
    setWhatsapp('');
    setEmail('');
    setCpf('');
    setIncome(3200);
    setTemDependente(true);
    setIsCotista(true);
    setFgts(0);
    setSinalAVista(0);
    setIntermediarias([]);
    setQtdParcelasObra(30);
    setValorParcelaObra(0);
    setQtdParcelasPosObra(44);
    setValorParcelaPosObra(0);
    setPropertyDetails({
      empreendimentoId: defaultEmp.id,
      nomeImovel: defaultEmp.nome,
      construtora: 'INC Empreendimentos',
      localizacao: `${defaultEmp.bairro}, ${defaultEmp.cidade} - ${defaultEmp.estado}`,
      unidade: 'Apto 204 - Bloco 02',
      tipologia: `${defaultTipo.nome} (${defaultTipo.areaM2} m²)`,
      areaM2: defaultTipo.areaM2,
      valorImovel: defaultTipo.valorPadrao,
    });
    setValorImovel(defaultTipo.valorPadrao);
  };

  const handleResetDataToDefault = () => {
    setMcmvData(INITIAL_MCMV_DATA);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-sans antialiased selection:bg-[#FF600B] selection:text-white">
      {/* Sticky Header */}
      <Header
        currentStep={currentStep}
        onReset={handleReset}
        onOpenTableModal={() => setIsTableModalOpen(true)}
        onOpenClientsModal={() => setIsClientsModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Visual Step Progress Indicator */}
      <StepIndicator
        currentStep={currentStep}
        onNavigateToStep={(step) => setCurrentStep(step)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        <AnimatePresence mode="wait">
          {currentStep === 'dados_cliente' && (
            <Step2ClientData
              key="dados_cliente"
              nomeCliente={nomeCliente}
              setNomeCliente={setNomeCliente}
              whatsapp={whatsapp}
              setWhatsapp={setWhatsapp}
              email={email}
              setEmail={setEmail}
              cpf={cpf}
              setCpf={setCpf}
              income={income}
              setIncome={setIncome}
              temDependente={temDependente}
              setTemDependente={setTemDependente}
              isCotista={isCotista}
              setIsCotista={setIsCotista}
              onNext={handleCalculateMcmv}
            />
          )}

          {currentStep === 'resultado_mcmv' && (
            <Step3McmvResult
              key="resultado_mcmv"
              simulationResult={simulationResult}
              nomeCliente={nomeCliente}
              onNext={() => {
                autoSaveLead('Em Atendimento');
                setCurrentStep('escolha_imovel');
              }}
              onBack={() => setCurrentStep('dados_cliente')}
              onEditClientData={() => setCurrentStep('dados_cliente')}
            />
          )}

          {currentStep === 'escolha_imovel' && (
            <Step3EscolhaImovel
              key="escolha_imovel"
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              valorImovel={valorImovel}
              setValorImovel={setValorImovel}
              onNext={() => {
                autoSaveLead('Em Atendimento');
                setCurrentStep('valores_cliente');
              }}
              onBack={() => setCurrentStep('resultado_mcmv')}
            />
          )}

          {currentStep === 'valores_cliente' && (
            <Step4ValoresCliente
              key="valores_cliente"
              propertyDetails={propertyDetails}
              valorImovel={valorImovel}
              financiamentoCaixa={financiamentoCaixa}
              subsidioCaixa={subsidioCaixa}
              fgts={fgts}
              setFgts={setFgts}
              onNext={() => {
                autoSaveLead('Em Atendimento');
                setCurrentStep('fluxo_construtora');
              }}
              onBack={() => setCurrentStep('escolha_imovel')}
            />
          )}

          {currentStep === 'fluxo_construtora' && (
            <Step5IncFlow
              key="fluxo_construtora"
              propertyDetails={propertyDetails}
              valorImovel={valorImovel}
              saldoEntrada={saldoEntrada}
              sinalAVista={sinalAVista}
              setSinalAVista={setSinalAVista}
              qtdParcelasObra={qtdParcelasObra}
              setQtdParcelasObra={setQtdParcelasObra}
              valorParcelaObra={valorParcelaObra}
              setValorParcelaObra={setValorParcelaObra}
              qtdParcelasPosObra={qtdParcelasPosObra}
              setQtdParcelasPosObra={setQtdParcelasPosObra}
              valorParcelaPosObra={valorParcelaPosObra}
              setValorParcelaPosObra={setValorParcelaPosObra}
              correcaoObra={correcaoObra}
              setCorrecaoObra={setCorrecaoObra}
              correcaoPosObra={correcaoPosObra}
              setCorrecaoPosObra={setCorrecaoPosObra}
              intermediarias={intermediarias}
              setIntermediarias={setIntermediarias}
              incluirDocumentacao={incluirDocumentacao}
              setIncluirDocumentacao={setIncluirDocumentacao}
              valorDocumentacao={valorDocumentacao}
              setValorDocumentacao={setValorDocumentacao}
              parcelasDocumentacao={parcelasDocumentacao}
              setParcelasDocumentacao={setParcelasDocumentacao}
              onNext={() => {
                autoSaveLead('Proposta Gerada');
                setCurrentStep('resumo_final');
              }}
              onBack={() => setCurrentStep('valores_cliente')}
            />
          )}

          {currentStep === 'resumo_final' && (
            <Step6Summary
              key="resumo_final"
              nomeCliente={nomeCliente}
              whatsapp={whatsapp}
              email={email}
              cpf={cpf}
              propertyDetails={propertyDetails}
              simulationResult={simulationResult}
              valorImovel={valorImovel}
              financiamentoCaixa={financiamentoCaixa}
              subsidioCaixa={subsidioCaixa}
              fgts={fgts}
              sinalAVista={sinalAVista}
              qtdParcelasObra={qtdParcelasObra}
              valorParcelaObra={valorParcelaObra}
              qtdParcelasPosObra={qtdParcelasPosObra}
              valorParcelaPosObra={valorParcelaPosObra}
              correcaoObra={correcaoObra}
              correcaoPosObra={correcaoPosObra}
              intermediarias={intermediarias}
              incluirDocumentacao={incluirDocumentacao}
              valorDocumentacao={valorDocumentacao}
              parcelasDocumentacao={parcelasDocumentacao}
              theme={theme}
              onBack={() => setCurrentStep('fluxo_construtora')}
              onEditStep={(step) => {
                setCurrentStep(step);
              }}
              onNewSimulation={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Reference Table Inspection Modal */}
      <TableDataModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        mcmvData={mcmvData}
        setMcmvData={setMcmvData}
        onResetData={handleResetDataToDefault}
      />

      {/* Clientes Panel Modal */}
      <ClientsModal
        isOpen={isClientsModalOpen}
        onClose={() => setIsClientsModalOpen(false)}
        onSelectClient={handleSelectSavedClient}
      />
    </div>
  );
}
