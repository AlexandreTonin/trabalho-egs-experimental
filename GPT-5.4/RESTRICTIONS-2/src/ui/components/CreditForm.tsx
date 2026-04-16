"use client";

import { FormEvent, useState } from "react";
import { analyzeCredit } from "@/service/creditAnalysisService";
import { AnalysisResult, CustomerData, DebtHistory } from "@/types/credit";

type FormState = {
  age: string;
  monthlyIncome: string;
  debtHistory: DebtHistory;
  requestedLoan: string;
};

const initialFormState: FormState = {
  age: "",
  monthlyIncome: "",
  debtHistory: "limpo",
  requestedLoan: ""
};

const numberFields = [
  { label: "Idade", name: "age" },
  { label: "Renda mensal", name: "monthlyIncome" },
  { label: "Valor do emprestimo solicitado", name: "requestedLoan" }
] as const;

// UI layer: renderiza a interface e delega toda regra ao service.
export function CreditForm() {
  const [formState, setFormState] = useState(initialFormState);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setResult(analyzeCredit(toCustomerData(formState))); };
  const handleChange = (name: keyof FormState, value: string) => setFormState((current) => ({ ...current, [name]: value }));
  return <main className="page"><section className="panel"><Hero /><div className="card"><form className="form" onSubmit={handleSubmit}>{numberFields.map(({ label, name }) => <Field key={name} label={label} name={name} value={formState[name]} type="number" onChange={handleChange} />)}<SelectField label="Historico de dividas" name="debtHistory" value={formState.debtHistory} onChange={handleChange} /><button className="button" type="submit">Analisar credito</button></form><ResultPanel result={result} /></div></section></main>;
}

type FieldProps = {
  label: string;
  name: keyof FormState;
  value: string;
  type: string;
  onChange: (name: keyof FormState, value: string) => void;
};

function Field({ label, name, value, type, onChange }: FieldProps) {
  return <label className="field"><span className="label">{label}</span><input className="input" min="0" name={name} type={type} value={value} onChange={(event) => onChange(name, event.target.value)} /></label>;
}

type SelectFieldProps = {
  label: string;
  name: keyof FormState;
  value: DebtHistory;
  onChange: (name: keyof FormState, value: string) => void;
};

function SelectField({ label, name, value, onChange }: SelectFieldProps) {
  return <label className="field"><span className="label">{label}</span><select className="select" name={name} value={value} onChange={(event) => onChange(name, event.target.value)}><option value="limpo">Limpo</option><option value="negativado">Negativado</option></select></label>;
}

function ResultPanel({ result }: { result: AnalysisResult | null }) {
  if (!result) return <EmptyResult />;
  return <section className="result"><p className={`status ${getStatusClassName(result.status)}`}>{result.status}</p><p className="subtitle">Parcela mensal: {formatCurrency(result.installment)} | Comprometimento: {formatPercentage(result.compromisedIncome)}</p><ul className="list">{getResultLines(result).map((line) => <li key={line}>{line}</li>)}</ul></section>;
}

function EmptyResult() {
  return <section className="result"><p className="status">Resultado da analise</p><p className="subtitle">Envie os dados para visualizar a decisao de credito.</p></section>;
}

function Hero() {
  return <div className="hero"><p className="eyebrow">Analise Inteligente</p><h1 className="title">Credito em 12 parcelas com decisao instantanea.</h1><p className="subtitle">Preencha os dados do cliente para validar idade, capacidade de pagamento e historico financeiro sem colocar regra de negocio na interface.</p></div>;
}

function getStatusClassName(status: AnalysisResult["status"]) {
  return status === "Aprovado" ? "approved" : "rejected";
}

function getResultLines(result: AnalysisResult) {
  return result.reasons.length ? result.reasons : ["Todas as condicoes foram atendidas."];
}

function toCustomerData(formState: FormState): CustomerData {
  return {
    age: Number(formState.age),
    monthlyIncome: Number(formState.monthlyIncome),
    debtHistory: formState.debtHistory,
    requestedLoan: Number(formState.requestedLoan)
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatPercentage(value: number) {
  return `${value.toFixed(2)}%`;
}
