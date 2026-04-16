"use client";

import { CSSProperties, useState, useSyncExternalStore } from "react";
import { listCreditLogs, subscribeCreditLogs } from "@/repository/creditLogRepository";
import { analyzeCredit } from "@/service/creditAnalysisService";
import { CreditAnalysisResult, CreditFormValues } from "@/types/credit";
import { CreditForm } from "@/ui/components/CreditForm";
import { CreditLogsPanel } from "@/ui/components/CreditLogsPanel";
import { CreditResultCard } from "@/ui/components/CreditResultCard";

const initialValues: CreditFormValues = {
  age: "",
  monthlyIncome: "",
  debtHistory: "limpo",
  loanAmount: "",
};

const fullWidthPanelStyle: CSSProperties = { gridColumn: "1 / -1" };

function ScreenHero() {
  return <section className="hero"><span className="hero__eyebrow">Central de risco</span><h1 className="hero__title">Análise de crédito com regras claras e registro local.</h1><p className="hero__description">Preencha os dados do cliente, execute a análise e acompanhe o histórico de decisões.</p></section>;
}

function RequestPanel(props: { values: CreditFormValues; onChange: (field: keyof CreditFormValues, value: string) => void; onSubmit: () => void }) {
  return <div className="panel panel--tall"><h2 className="panel__title">Solicitação</h2><p className="panel__text">A interface captura os dados e envia tudo para a camada de serviço.</p><CreditForm values={props.values} onChange={props.onChange} onSubmit={props.onSubmit} /></div>;
}

function ResultPanel({ result }: { result: CreditAnalysisResult | null }) {
  return <div className="panel panel--tall"><h2 className="panel__title">Resultado</h2><p className="panel__text">A decisão final só é aprovada quando todas as regras são atendidas.</p><CreditResultCard result={result} /></div>;
}

function LogsPanel() {
  const logs = useSyncExternalStore(subscribeCreditLogs, listCreditLogs, () => []);
  return <div className="panel" style={fullWidthPanelStyle}><h2 className="panel__title">Logs registrados</h2><p className="panel__text">Cada análise salva data, dados do cliente e resultado no LocalStorage.</p><CreditLogsPanel logs={logs} /></div>;
}

// Camada UI: renderiza a interface e delega processamento para o Service.
export function CreditAnalysisScreen() {
  const [formValues, setFormValues] = useState(initialValues);
  const [result, setResult] = useState<CreditAnalysisResult | null>(null);

  function handleFieldChange(field: keyof CreditFormValues, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit() {
    setResult(analyzeCredit(formValues));
  }

  return <main className="page-shell"><ScreenHero /><section className="content-grid"><RequestPanel values={formValues} onChange={handleFieldChange} onSubmit={handleSubmit} /><ResultPanel result={result} /><LogsPanel /></section></main>;
}
