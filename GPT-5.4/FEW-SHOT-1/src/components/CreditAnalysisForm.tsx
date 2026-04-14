"use client";

import { FormEvent, useState } from "react";

import { readFromLocalStorage } from "@/repositories/localStorageRepository";
import { analyzeCredit, getAnalysisRules } from "@/services/creditAnalysisService";
import { CreditAnalysisInput, CreditAnalysisLog, DebtHistoryStatus } from "@/types/credit";
import { getCreditAnalysisLogKey, logCreditAnalysis } from "@/utils/logger";

const initialFormState: CreditAnalysisInput = {
  age: 18,
  monthlyIncome: 0,
  debtHistory: "limpo",
  loanAmount: 0,
};

export function CreditAnalysisForm() {
  const [formData, setFormData] = useState<CreditAnalysisInput>(initialFormState);
  const [logs, setLogs] = useState<CreditAnalysisLog[]>(() => {
    const persistedLogs = readFromLocalStorage<CreditAnalysisLog>(getCreditAnalysisLogKey());
    return [...persistedLogs].reverse();
  });
  const [lastResult, setLastResult] = useState<CreditAnalysisLog | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = analyzeCredit(formData);
    const logEntry = logCreditAnalysis(formData, result);
    setLastResult(logEntry);
    setLogs((currentLogs) => [logEntry, ...currentLogs]);
  }

  function handleNumberChange(field: "age" | "monthlyIncome" | "loanAmount", value: string) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: Number(value),
    }));
  }

  function handleDebtHistoryChange(value: DebtHistoryStatus) {
    setFormData((currentData) => ({
      ...currentData,
      debtHistory: value,
    }));
  }

  const { installmentMonths, maxIncomeCommitment } = getAnalysisRules();

  return (
    <div className="page-grid">
      <section className="card">
        <div className="section-heading">
          <span className="eyebrow">Formulário</span>
          <h2>Análise de crédito</h2>
          <p>
            Informe os dados do cliente para validar idade, renda, parcela estimada e
            histórico de dívidas.
          </p>
        </div>

        <form className="credit-form" onSubmit={handleSubmit}>
          <label>
            <span>Idade</span>
            <input
              min="0"
              type="number"
              value={formData.age}
              onChange={(event) => handleNumberChange("age", event.target.value)}
            />
          </label>

          <label>
            <span>Renda mensal</span>
            <input
              min="0"
              step="0.01"
              type="number"
              value={formData.monthlyIncome}
              onChange={(event) => handleNumberChange("monthlyIncome", event.target.value)}
            />
          </label>

          <label>
            <span>Histórico de dívidas</span>
            <select
              value={formData.debtHistory}
              onChange={(event) => handleDebtHistoryChange(event.target.value as DebtHistoryStatus)}
            >
              <option value="limpo">Limpo</option>
              <option value="negativado">Negativado</option>
            </select>
          </label>

          <label>
            <span>Valor do empréstimo</span>
            <input
              min="0"
              step="0.01"
              type="number"
              value={formData.loanAmount}
              onChange={(event) => handleNumberChange("loanAmount", event.target.value)}
            />
          </label>

          <button type="submit">Analisar crédito</button>
        </form>

        <div className="rules-box">
          <strong>Regras aplicadas</strong>
          <p>Idade mínima: 18 anos.</p>
          <p>Parcelamento simulado: {installmentMonths} meses fixos.</p>
          <p>Comprometimento máximo: {(maxIncomeCommitment * 100).toFixed(0)}% da renda.</p>
          <p>Clientes com status negativado são reprovados.</p>
        </div>
      </section>

      <section className="card">
        <div className="section-heading">
          <span className="eyebrow">Resultado</span>
          <h2>Parecer da análise</h2>
          <p>Veja o status mais recente e o histórico das avaliações já registradas.</p>
        </div>

        {lastResult ? (
          <div className={`result-box ${lastResult.result.approved ? "approved" : "rejected"}`}>
            <strong>{lastResult.result.message}</strong>
            <p>Parcela estimada: R$ {lastResult.result.installmentAmount.toFixed(2)}</p>
            <p>
              Comprometimento de renda:{" "}
              {(lastResult.result.incomeCommitmentRatio * 100).toFixed(2)}%
            </p>
            {lastResult.result.reasons.length > 0 ? (
              <ul>
                {lastResult.result.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p>Todas as regras foram atendidas.</p>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p>{logs.length > 0 ? "Selecione um novo cenário para gerar outro parecer." : "Nenhuma análise realizada ainda."}</p>
          </div>
        )}

        <div className="history-header">
          <h3>Logs da análise</h3>
          <span>{logs.length} registro(s)</span>
        </div>

        <div className="log-list">
          {logs.length > 0 ? (
            logs.map((log) => (
              <article className="log-item" key={`${log.createdAt}-${log.input.age}-${log.input.loanAmount}`}>
                <div className="log-item-header">
                  <strong>{log.result.message}</strong>
                  <span>{new Date(log.createdAt).toLocaleString("pt-BR")}</span>
                </div>
                <p>
                  Idade: {log.input.age} | Renda: R$ {log.input.monthlyIncome.toFixed(2)} | Histórico:{" "}
                  {log.input.debtHistory}
                </p>
                <p>Empréstimo solicitado: R$ {log.input.loanAmount.toFixed(2)}</p>
              </article>
            ))
          ) : (
            <p className="empty-list">Os logs serão exibidos aqui após o primeiro envio.</p>
          )}
        </div>
      </section>
    </div>
  );
}
