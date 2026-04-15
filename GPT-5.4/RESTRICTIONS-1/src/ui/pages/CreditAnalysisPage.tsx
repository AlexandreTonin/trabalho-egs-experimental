'use client';

import { AnalysisResult } from '@/ui/components/AnalysisResult';
import { CreditForm } from '@/ui/components/CreditForm';
import { LogList } from '@/ui/components/LogList';
import { useCreditAnalysis } from '@/ui/hooks/useCreditAnalysis';

// Camada UI: compoe a pagina e conecta componentes visuais ao hook da tela.
export function CreditAnalysisPage() {
  const { formData, logs, result, submitAnalysis, updateDebtHistory, updateNumberField } = useCreditAnalysis();
  return <main className="page-shell"><div className="page-grid"><HeroSection /><CreditForm formData={formData} onDebtHistoryChange={updateDebtHistory} onNumberChange={updateNumberField} onSubmit={submitAnalysis} /><AnalysisResult result={result} /><LogList logs={logs} /></div></main>;
}

function HeroSection() {
  return <section className="panel"><p className="helper-text">Next.js 16.2.3</p><h1 className="hero-title">Analise de credito com regras claras e logs locais.</h1><p className="hero-copy">A interface coleta os dados, o service avalia o risco e o repository persiste o historico.</p><ul className="rule-list"><li>Cliente precisa ter pelo menos 18 anos.</li><li>A parcela em 12x nao pode ultrapassar 30% da renda.</li><li>Historico negativado reprova a solicitacao.</li></ul></section>;
}
