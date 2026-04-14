"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import { AnalysisResultCard } from "@/components/AnalysisResultCard";
import {
  AnalysisLogEntry,
  CreditAnalysisInput,
  CreditAnalysisResult
} from "@/types/credit";

const initialForm: CreditAnalysisInput = {
  age: 18,
  monthlyIncome: 3000,
  debtHistory: "limpo",
  loanAmount: 12000
};

export function CreditAnalysisForm() {
  const [form, setForm] = useState<CreditAnalysisInput>(initialForm);
  const [result, setResult] = useState<CreditAnalysisResult | null>(null);
  const [logs, setLogs] = useState<AnalysisLogEntry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadLogs() {
    try {
      const response = await fetch("/api/analyses");
      const data = (await response.json()) as { logs: AnalysisLogEntry[] };
      setLogs(data.logs);
    } catch {
      // O histórico é complementar; se falhar, mantemos a tela utilizável.
      setLogs([]);
    }
  }

  useEffect(() => {
    void loadLogs();
  }, []);

  function updateField<Key extends keyof CreditAnalysisInput>(
    field: Key,
    value: CreditAnalysisInput[Key]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as
        | { success: true; result: CreditAnalysisResult; log: AnalysisLogEntry }
        | { success: false; errors: string[] };

      if (!response.ok || !data.success) {
        setResult(null);
        setErrors("errors" in data ? data.errors : ["Falha ao analisar crédito."]);
        return;
      }

      setResult(data.result);
      setLogs((current) => [data.log, ...current].slice(0, 20));
    } catch {
      setResult(null);
      setErrors(["Não foi possível concluir a análise neste momento."]);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setResult(null);
    setErrors([]);
  }

  return (
    <div className="grid">
      <section className="panel">
        <h2>Dados para análise</h2>
        <p className="helper">
          O sistema valida maioridade, parcela em 12 vezes, comprometimento de
          até 30% da renda e situação do histórico de dívidas.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="age">Idade</label>
              <input
                id="age"
                min="0"
                type="number"
                value={form.age}
                onChange={(event) => updateField("age", Number(event.target.value))}
              />
            </div>

            <div className="field">
              <label htmlFor="monthlyIncome">Renda mensal</label>
              <input
                id="monthlyIncome"
                min="0"
                step="0.01"
                type="number"
                value={form.monthlyIncome}
                onChange={(event) =>
                  updateField("monthlyIncome", Number(event.target.value))
                }
              />
            </div>

            <div className="field">
              <label htmlFor="debtHistory">Histórico de dívidas</label>
              <select
                id="debtHistory"
                value={form.debtHistory}
                onChange={(event) =>
                  updateField(
                    "debtHistory",
                    event.target.value as CreditAnalysisInput["debtHistory"]
                  )
                }
              >
                <option value="limpo">Limpo</option>
                <option value="negativado">Negativado</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="loanAmount">Valor do empréstimo</label>
              <input
                id="loanAmount"
                min="0"
                step="0.01"
                type="number"
                value={form.loanAmount}
                onChange={(event) =>
                  updateField("loanAmount", Number(event.target.value))
                }
              />
            </div>
          </div>

          {errors.length > 0 && (
            <div className="field field-full" style={{ marginTop: 18 }}>
              {errors.map((error) => (
                <span key={error} className="error">
                  {error}
                </span>
              ))}
            </div>
          )}

          <div className="actions">
            <button className="primary-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Analisando..." : "Enviar para análise"}
            </button>

            <button
              className="secondary-button"
              disabled={isSubmitting}
              onClick={handleReset}
              type="button"
            >
              Limpar
            </button>
          </div>
        </form>

        {result ? <AnalysisResultCard result={result} /> : null}
      </section>

      <AnalysisHistory logs={logs} />
    </div>
  );
}
