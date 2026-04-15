"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./credit-analysis-form.module.css";
import {
  AnalysisLogEntry,
  AnalysisRequest,
  AnalysisResponse,
  DebtHistoryOption
} from "@/types/credit";

type CreditAnalysisFormProps = {
  latestLogs: AnalysisLogEntry[];
};

const initialFormData: AnalysisRequest = {
  age: 18,
  monthlyIncome: 0,
  debtHistory: "clean",
  requestedLoanAmount: 0
};

export function CreditAnalysisForm({
  latestLogs
}: CreditAnalysisFormProps) {
  const [formData, setFormData] = useState<AnalysisRequest>(initialFormData);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: Number(value)
    }));
  }

  function handleDebtHistoryChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as DebtHistoryOption;

    setFormData((currentData) => ({
      ...currentData,
      debtHistory: value
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = (await response.json()) as AnalysisResponse & {
        message?: string;
      };

      if (!response.ok) {
        setAnalysisResult(null);
        setErrorMessage(data.message ?? "Falha ao processar a analise.");
        return;
      }

      setAnalysisResult(data);
    } catch (error) {
      console.error("Erro de comunicacao com a API:", error);
      setAnalysisResult(null);
      setErrorMessage("Nao foi possivel se comunicar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.layout}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.kicker}>Formulario</p>
            <h2>Dados para analise</h2>
          </div>
          <span className={styles.ruleTag}>12 parcelas fixas</span>
        </div>

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
            <label htmlFor="debtHistory">Historico de dividas</label>
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
            <label htmlFor="requestedLoanAmount">Valor do emprestimo</label>
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
            {isSubmitting ? "Analisando..." : "Enviar dados"}
          </button>
        </form>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.kicker}>Resultado</p>
            <h2>Decisao de credito</h2>
          </div>
        </div>

        {errorMessage ? (
          <p className={styles.errorMessage}>{errorMessage}</p>
        ) : null}

        {analysisResult ? (
          <div className={styles.resultBlock}>
            <p
              className={
                analysisResult.approved ? styles.approvedBadge : styles.rejectedBadge
              }
            >
              {analysisResult.approved ? "Aprovado" : "Reprovado"}
            </p>

            <div className={styles.metrics}>
              <article>
                <span>Parcela mensal</span>
                <strong>
                  {analysisResult.monthlyInstallment.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}
                </strong>
              </article>

              <article>
                <span>Comprometimento da renda</span>
                <strong>
                  {analysisResult.incomeCommitmentPercentage.toFixed(2)}%
                </strong>
              </article>
            </div>

            <div className={styles.reasonList}>
              <h3>Regras avaliadas</h3>
              <ul>
                {analysisResult.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className={styles.placeholder}>
            O status final da analise aparecera aqui depois do envio do formulario.
          </p>
        )}

        <div className={styles.logBlock}>
          <div className={styles.logHeader}>
            <h3>Ultimas analises registradas</h3>
            <span>{latestLogs.length} exibidas</span>
          </div>

          {latestLogs.length > 0 ? (
            <ul className={styles.logList}>
              {latestLogs.map((log) => (
                <li key={`${log.timestamp}-${log.customerData.age}`}>
                  <div>
                    <strong>{log.analysis.approved ? "Aprovado" : "Reprovado"}</strong>
                    <span>
                      {new Date(log.timestamp).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short"
                      })}
                    </span>
                  </div>
                  <p>
                    Idade {log.customerData.age}, renda{" "}
                    {log.customerData.monthlyIncome.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                    , emprestimo{" "}
                    {log.customerData.requestedLoanAmount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                    .
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.placeholder}>Nenhuma analise foi registrada ainda.</p>
          )}
        </div>
      </section>
    </div>
  );
}
