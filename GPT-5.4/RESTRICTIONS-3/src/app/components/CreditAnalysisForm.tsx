"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { CreditAnalysisResult, CreditFormData, DebtHistory } from "@/types/credit";

const initialFormData: CreditFormData = { idade: 18, rendaMensal: 0, historicoDividas: "limpo", valorEmprestimo: 0 };

type FormState = { formData: CreditFormData; result: CreditAnalysisResult | null; error: string; loading: boolean };
type SubmitSuccess = { ok: true; payload: CreditAnalysisResult };
type SubmitFailure = { ok: false; payload: { message: string } };
type SubmitResponse = SubmitSuccess | SubmitFailure;
type ChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

// UI layer: coleta os dados, chama a API e apenas renderiza o retorno recebido.
export function CreditAnalysisForm() {
  const [state, setState] = useState<FormState>(createInitialState());
  async function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setState(startLoadingState); const response = await submitCreditAnalysis(state.formData); setState((current) => buildNextState(current, response)); }
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) { const { name, value } = event.target; setState((current) => ({ ...current, formData: updateFormData(current.formData, name, value) })); }
  return <section className="card"><FormIntro /><CreditFields formData={state.formData} loading={state.loading} onChange={handleChange} onSubmit={handleSubmit} /><ResultPanel error={state.error} result={state.result} /></section>;
}

function createInitialState(): FormState {
  return { formData: initialFormData, result: null, error: "", loading: false };
}

function startLoadingState(current: FormState): FormState {
  return { ...current, loading: true, error: "", result: null };
}

function updateFormData(formData: CreditFormData, name: string, value: string) {
  return name === "historicoDividas" ? { ...formData, [name]: value as DebtHistory } : { ...formData, [name]: Number(value) };
}

async function submitCreditAnalysis(formData: CreditFormData): Promise<SubmitResponse> {
  const response = await fetch("/api/credit-analysis", createRequestOptions(formData));
  return response.ok ? { ok: true, payload: await response.json() } : { ok: false, payload: await response.json() };
}

function createRequestOptions(formData: CreditFormData) {
  return { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) };
}

function buildNextState(current: FormState, response: SubmitResponse): FormState {
  return response.ok ? buildSuccessState(current, response.payload) : buildFailureState(current, response.payload.message);
}

function buildSuccessState(current: FormState, result: CreditAnalysisResult): FormState {
  return { ...current, loading: false, error: "", result };
}

function buildFailureState(current: FormState, error: string): FormState {
  return { ...current, loading: false, error, result: null };
}

function FormIntro() {
  return <div className="intro"><span className="eyebrow">Analise automatizada</span><h1>Credito de clientes</h1><p>Preencha os dados para verificar se a solicitacao de emprestimo pode ser aprovada.</p></div>;
}

function CreditFields({ formData, loading, onChange, onSubmit }: CreditFieldsProps) {
  return <form className="form" onSubmit={onSubmit}><NumberField label="Idade" min="18" name="idade" value={formData.idade} onChange={onChange} /><NumberField label="Renda mensal" min="0" name="rendaMensal" step="0.01" value={formData.rendaMensal} onChange={onChange} /><DebtHistoryField value={formData.historicoDividas} onChange={onChange} /><NumberField label="Valor do emprestimo" min="0" name="valorEmprestimo" step="0.01" value={formData.valorEmprestimo} onChange={onChange} /><button disabled={loading} type="submit">{loading ? "Analisando..." : "Enviar dados"}</button></form>;
}

function NumberField({ label, min, name, onChange, step, value }: NumberFieldProps) {
  return <label><span>{label}</span><input min={min} name={name} onChange={onChange} step={step} type="number" value={value} /></label>;
}

function DebtHistoryField({ onChange, value }: DebtHistoryFieldProps) {
  return <label><span>Historico de dividas</span><select name="historicoDividas" onChange={onChange} value={value}><option value="limpo">Limpo</option><option value="negativado">Negativado</option></select></label>;
}

function ResultPanel({ error, result }: ResultProps) {
  if (error) return <section className="result error">{error}</section>;
  if (!result) return <section className="result pending">O resultado da analise aparecera aqui.</section>;
  return <section className={`result ${result.status === "Aprovado" ? "approved" : "rejected"}`}><h2>{result.status}</h2><p>Parcela fixa em 12x: R$ {result.installmentValue.toFixed(2)}</p><p>{result.reasons[0] ?? "Todas as condicoes foram atendidas."}</p></section>;
}

type CreditFieldsProps = { formData: CreditFormData; loading: boolean; onChange: ChangeHandler; onSubmit: (event: FormEvent<HTMLFormElement>) => void };
type NumberFieldProps = { label: string; min: string; name: "idade" | "rendaMensal" | "valorEmprestimo"; onChange: ChangeHandler; step?: string; value: number };
type DebtHistoryFieldProps = { onChange: ChangeHandler; value: DebtHistory };
type ResultProps = { error: string; result: CreditAnalysisResult | null };
