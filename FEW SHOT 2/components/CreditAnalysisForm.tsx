"use client";

import type { FormEvent } from "react";
import { useState, useSyncExternalStore } from "react";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import {
  getCreditAnalysisLogs,
  logCreditAnalysis,
  subscribeToCreditAnalysisLogs
} from "@/utils/logger";
import { creditPolicy, processCreditAnalysis } from "@/service/creditAnalysisService";
import type { CreditAnalysisInput, CreditAnalysisResult, DebtHistory } from "@/types/credit";

type FormState = {
  age: string;
  monthlyIncome: string;
  debtHistory: DebtHistory;
  requestedAmount: string;
};

const INITIAL_FORM_STATE: FormState = {
  age: "",
  monthlyIncome: "",
  debtHistory: "limpo",
  requestedAmount: ""
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function formatPercentage(value: number) {
  return `${value.toFixed(2)}%`;
}

export function CreditAnalysisForm() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [result, setResult] = useState<CreditAnalysisResult | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const logs = useSyncExternalStore(
    subscribeToCreditAnalysisLogs,
    getCreditAnalysisLogs,
    () => []
  );

  function handleChange(field: keyof FormState, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
  }

  function buildPayload(): CreditAnalysisInput {
    return {
      age: Number(formData.age),
      monthlyIncome: Number(formData.monthlyIncome),
      debtHistory: formData.debtHistory,
      requestedAmount: Number(formData.requestedAmount)
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedbackError(null);

    const payload = buildPayload();
    const analysisResult = processCreditAnalysis(payload);

    setResult(analysisResult);

    if (analysisResult.reasons.length > 0 && analysisResult.monthlyInstallment === 0) {
      setFeedbackError("Revise os dados preenchidos antes de enviar novamente.");
      return;
    }

    logCreditAnalysis(payload, analysisResult);
  }

  return (
    <div className="content-grid">
      <section className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="age">Idade</label>
              <input
                id="age"
                min="0"
                name="age"
                placeholder="Ex.: 32"
                step="1"
                type="number"
                value={formData.age}
                onChange={(event) => handleChange("age", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="monthlyIncome">Renda mensal</label>
              <input
                id="monthlyIncome"
                min="0"
                name="monthlyIncome"
                placeholder="Ex.: 4500"
                step="0.01"
                type="number"
                value={formData.monthlyIncome}
                onChange={(event) => handleChange("monthlyIncome", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="debtHistory">Histórico de dívidas</label>
              <select
                id="debtHistory"
                name="debtHistory"
                value={formData.debtHistory}
                onChange={(event) =>
                  handleChange("debtHistory", event.target.value as DebtHistory)
                }
              >
                <option value="limpo">Limpo</option>
                <option value="negativado">Negativado</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="requestedAmount">Valor do empréstimo</label>
              <input
                id="requestedAmount"
                min="0"
                name="requestedAmount"
                placeholder="Ex.: 12000"
                step="0.01"
                type="number"
                value={formData.requestedAmount}
                onChange={(event) => handleChange("requestedAmount", event.target.value)}
              />
            </div>

            <div className="field field-full">
              <p className="hint">
                Regra atual: o crédito só é aprovado para maiores de 18 anos, com histórico
                limpo e parcela em {creditPolicy.installmentMonths} meses comprometendo até{" "}
                {creditPolicy.maxCommitmentRate}% da renda.
              </p>
            </div>
          </div>

          {feedbackError ? <p className="error-message">{feedbackError}</p> : null}

          <button className="submit-button" type="submit">
            Analisar crédito
          </button>
        </form>

        {result ? (
          <div className={`result-card ${result.approved ? "approved" : "rejected"}`}>
            <h2>Resultado da análise</h2>
            <span className={`result-badge ${result.approved ? "approved" : "rejected"}`}>
              {result.approved ? "Aprovado" : "Reprovado"}
            </span>
            <p>{result.message}</p>

            <div className="metrics">
              <div className="metric">
                <span>Parcela mensal</span>
                <strong>{formatCurrency(result.monthlyInstallment)}</strong>
              </div>
              <div className="metric">
                <span>Comprometimento da renda</span>
                <strong>{formatPercentage(result.commitmentRate)}</strong>
              </div>
            </div>

            {result.reasons.length > 0 ? (
              <p className="reason-list">Motivos: {result.reasons.join(" ")}</p>
            ) : (
              <p className="reason-list">
                Todas as condições da política de crédito foram atendidas.
              </p>
            )}
          </div>
        ) : null}
      </section>

      <AnalysisHistory logs={logs} />
    </div>
  );
}
