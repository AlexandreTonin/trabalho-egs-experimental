"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./credit-analysis-form.module.css";
import {
  AnalysisRequest,
  AnalysisResponse,
  DebtHistoryOption
} from "@/types/credit";

const initialFormData: AnalysisRequest = {
  age: 18,
  monthlyIncome: 0,
  debtHistory: "clean",
  requestedLoanAmount: 0
};

export function CreditAnalysisForm() {
  const [formData, setFormData] = useState<AnalysisRequest>(initialFormData);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: Number(value)
    }));
  }

  function handleDebtHistoryChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as DebtHistoryOption;

    setFormData((current) => ({
      ...current,
      debtHistory: value
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message ?? "Erro ao enviar dados.");
        return;
      }

      setAnalysisResult(data);
    } catch (error) {
      console.error("Falha na chamada da API:", error);
      setErrorMessage("Erro de comunicação com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="age">Idade</label>
          <input
            id="age"
            min="0"
            name="age"
            onChange={handleNumberChange}
            required
            type="number"
            value={formData.age}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="monthlyIncome">Renda mensal</label>
          <input
            id="monthlyIncome"
            min="0"
            name="monthlyIncome"
            onChange={handleNumberChange}
            required
            step="0.01"
            type="number"
            value={formData.monthlyIncome}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="debtHistory">Histórico de dívidas</label>
          <select
            id="debtHistory"
            name="debtHistory"
            onChange={handleDebtHistoryChange}
            value={formData.debtHistory}
          >
            <option value="clean">Limpo</option>
            <option value="negative">Negativado</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="requestedLoanAmount">Valor do empréstimo</label>
          <input
            id="requestedLoanAmount"
            min="0"
            name="requestedLoanAmount"
            onChange={handleNumberChange}
            required
            step="0.01"
            type="number"
            value={formData.requestedLoanAmount}
          />
        </div>

        <button className={styles.submitButton} disabled={isSubmitting} type="submit">
          {isSubmitting ? "Analisando..." : "Enviar para análise"}
        </button>
      </form>

      <section className={styles.resultCard}>
        <h2>Resultado da análise</h2>

        {errorMessage ? (
          <p className={styles.errorMessage}>{errorMessage}</p>
        ) : null}

        {analysisResult ? (
          <>
            <p
              className={
                analysisResult.approved ? styles.approvedText : styles.rejectedText
              }
            >
              {analysisResult.approved ? "Aprovado" : "Reprovado"}
            </p>

            <div className={styles.summaryGrid}>
              <div>
                <span>Parcela mensal</span>
                <strong>
                  {analysisResult.monthlyInstallment.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}
                </strong>
              </div>

              <div>
                <span>Comprometimento</span>
                <strong>
                  {analysisResult.incomeCommitmentPercentage.toFixed(2)}%
                </strong>
              </div>
            </div>

            <div className={styles.reasonList}>
              <h3>Detalhes da avaliação</h3>
              <ul>
                {analysisResult.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className={styles.placeholderText}>
            O resultado aparecerá aqui após o envio do formulário.
          </p>
        )}
      </section>
    </div>
  );
}
