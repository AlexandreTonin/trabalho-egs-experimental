"use client";

import { FormEvent, useEffect, useState } from "react";
import type {
  AnalysisLogEntry,
  CreditAnalysisInput,
  CreditAnalysisResponse,
} from "@/lib/credit-analysis";
import { LogsList } from "@/components/LogsList";
import { ResultCard } from "@/components/ResultCard";

const initialFormData: CreditAnalysisInput = {
  age: 18,
  monthlyIncome: 0,
  debtHistory: "limpo",
  loanAmount: 0,
};

export function CreditAnalysisForm() {
  const [formData, setFormData] = useState<CreditAnalysisInput>(initialFormData);
  const [result, setResult] = useState<CreditAnalysisResponse | null>(null);
  const [logs, setLogs] = useState<AnalysisLogEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const response = await fetch("/api/credit-analysis", { method: "GET" });

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar os logs existentes.");
        }

        const payload = (await response.json()) as { logs: AnalysisLogEntry[] };
        setLogs(payload.logs);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Falha ao carregar os logs.",
        );
      } finally {
        setIsLoadingLogs(false);
      }
    }

    void loadLogs();
  }, []);

  function handleChange<K extends keyof CreditAnalysisInput>(
    field: K,
    value: CreditAnalysisInput[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/credit-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json()) as
        | CreditAnalysisResponse
        | { error: string };

      if (!response.ok || "error" in payload) {
        throw new Error(
          "error" in payload ? payload.error : "Nao foi possivel concluir a analise.",
        );
      }

      setResult(payload);
      setLogs((current) => [payload.logEntry, ...current].slice(0, 10));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <div className="analysis-layout">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="age">Idade</label>
            <input
              id="age"
              min={0}
              name="age"
              required
              type="number"
              value={formData.age}
              onChange={(event) => handleChange("age", Number(event.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="monthlyIncome">Renda mensal</label>
            <input
              id="monthlyIncome"
              min={0}
              name="monthlyIncome"
              required
              step="0.01"
              type="number"
              value={formData.monthlyIncome}
              onChange={(event) =>
                handleChange("monthlyIncome", Number(event.target.value))
              }
            />
          </div>

          <div className="field">
            <label htmlFor="debtHistory">Historico de dividas</label>
            <select
              id="debtHistory"
              name="debtHistory"
              value={formData.debtHistory}
              onChange={(event) =>
                handleChange(
                  "debtHistory",
                  event.target.value as CreditAnalysisInput["debtHistory"],
                )
              }
            >
              <option value="limpo">Limpo</option>
              <option value="negativado">Negativado</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="loanAmount">Valor do emprestimo</label>
            <input
              id="loanAmount"
              min={0}
              name="loanAmount"
              required
              step="0.01"
              type="number"
              value={formData.loanAmount}
              onChange={(event) =>
                handleChange("loanAmount", Number(event.target.value))
              }
            />
          </div>

          <div className="field field-full">
            <button className="submit-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Analisando..." : "Enviar para analise"}
            </button>
          </div>
        </form>

        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

        {result ? <ResultCard result={result} /> : null}

        <LogsList isLoading={isLoadingLogs} logs={logs} />
      </div>
    </section>
  );
}
