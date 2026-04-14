"use client";

import { FormEvent, useEffect, useState } from "react";

import { CreditAnalysisLogEntry, CreditAnalysisResult, DebtHistory } from "@/lib/types";

interface FormState {
  age: string;
  monthlyIncome: string;
  debtHistory: DebtHistory;
  loanAmount: string;
}

const initialState: FormState = {
  age: "",
  monthlyIncome: "",
  debtHistory: "limpo",
  loanAmount: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(value);
}

export function CreditAnalysisApp() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [result, setResult] = useState<CreditAnalysisResult | null>(null);
  const [logs, setLogs] = useState<CreditAnalysisLogEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void loadLogs();
  }, []);

  async function loadLogs() {
    const response = await fetch("/api/analyze", { cache: "no-store" });
    const data = (await response.json()) as { logs: CreditAnalysisLogEntry[] };
    setLogs(data.logs ?? []);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: Number(formState.age),
          monthlyIncome: Number(formState.monthlyIncome),
          debtHistory: formState.debtHistory,
          loanAmount: Number(formState.loanAmount),
        }),
      });

      const data = (await response.json()) as
        | { result: CreditAnalysisResult }
        | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Falha ao analisar credito.");
      }

      setResult(data.result);
      await loadLogs();
    } catch (error) {
      setResult(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Nao foi possivel processar a solicitacao.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <article className="hero-card hero-copy">
          <span className="eyebrow">Motor de decisao</span>
          <h1>Analise de credito com regras claras e log completo.</h1>
          <p>
            Avalie solicitacoes com base em maioridade, comprometimento maximo de
            30% da renda mensal e historico de dividas. Cada analise fica registrada
            com data, dados informados e resultado final.
          </p>
        </article>

        <aside className="hero-card hero-metrics">
          <div className="metric">
            <strong>12x</strong>
            Parcelas fixas consideradas em todas as simulacoes.
          </div>
          <div className="metric">
            <strong>30%</strong>
            Limite maximo de comprometimento da renda por parcela.
          </div>
          <div className="metric">
            <strong>{logs.length}</strong>
            Analises registradas neste ambiente.
          </div>
        </aside>
      </section>

      <section className="grid">
        <article className="content-card">
          <h2 className="section-title">Formulario de analise</h2>
          <p className="section-text">
            Preencha os dados do cliente e envie para calcular automaticamente a
            aprovacao ou reprovacao do credito.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="age">Idade</label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  value={formState.age}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, age: event.target.value }))
                  }
                  placeholder="Ex.: 28"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="monthlyIncome">Renda mensal</label>
                <input
                  id="monthlyIncome"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.monthlyIncome}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      monthlyIncome: event.target.value,
                    }))
                  }
                  placeholder="Ex.: 5000"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="debtHistory">Historico de dividas</label>
                <select
                  id="debtHistory"
                  value={formState.debtHistory}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      debtHistory: event.target.value as DebtHistory,
                    }))
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
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.loanAmount}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      loanAmount: event.target.value,
                    }))
                  }
                  placeholder="Ex.: 12000"
                  required
                />
              </div>
            </div>

            <button className="submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processando analise..." : "Enviar para analise"}
            </button>
          </form>

          {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
        </article>

        <article className="content-card">
          <h2 className="section-title">Resultado da avaliacao</h2>
          <p className="section-text">
            O sistema aprova o credito apenas quando todas as regras sao atendidas.
          </p>

          {result ? (
            <div className="result-card">
              <span
                className={
                  result.status === "Aprovado" ? "status-approved" : "status-rejected"
                }
              >
                {result.status}
              </span>
              <p>{result.message}</p>

              <ul className="conditions-list">
                <li className="condition-item">
                  Maior de idade: {result.conditions.isAdult ? "Sim" : "Nao"}
                </li>
                <li className="condition-item">
                  Historico sem restricoes:{" "}
                  {result.conditions.hasCleanDebtHistory ? "Sim" : "Nao"}
                </li>
                <li className="condition-item">
                  Parcela mensal estimada:{" "}
                  {formatCurrency(result.conditions.monthlyInstallment)}
                </li>
                <li className="condition-item">
                  Comprometimento da renda:{" "}
                  {formatPercent(result.conditions.installmentCommitmentRatio)}
                </li>
                <li className="condition-item">
                  Dentro do limite de 30%:{" "}
                  {result.conditions.isInstallmentWithinIncomeLimit ? "Sim" : "Nao"}
                </li>
              </ul>
            </div>
          ) : (
            <p className="helper-text">
              Nenhuma analise foi executada nesta sessao. Envie os dados para ver a
              decisao aqui.
            </p>
          )}
        </article>
      </section>

      <section className="content-card" style={{ marginTop: 24 }}>
        <h2 className="section-title">Logs das analises</h2>
        <p className="section-text">
          Cada solicitacao processada pela API fica salva em arquivo JSON no servidor.
        </p>

        {logs.length > 0 ? (
          <ul className="log-list">
            {logs.map((log) => (
              <li key={`${log.createdAt}-${log.input.age}-${log.input.loanAmount}`} className="log-item">
                <time dateTime={log.createdAt}>
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  }).format(new Date(log.createdAt))}
                </time>
                <strong>{log.result.status}</strong>
                <p>
                  Idade: {log.input.age} | Renda: {formatCurrency(log.input.monthlyIncome)} |
                  Historico: {log.input.debtHistory} | Emprestimo:{" "}
                  {formatCurrency(log.input.loanAmount)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="helper-text">
            Ainda nao existem logs gravados. O primeiro envio cria o arquivo de
            persistencia automaticamente.
          </p>
        )}
      </section>
    </main>
  );
}
