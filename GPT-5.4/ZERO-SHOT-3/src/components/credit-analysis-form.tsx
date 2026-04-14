"use client";

import { FormEvent, useEffect, useState } from "react";

import { formatCurrency, formatDateTime, formatPercentage } from "@/lib/formatters";
import { CreditAnalysisInput, CreditAnalysisLog, CreditAnalysisResult, DebtHistory } from "@/types/credit";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const initialForm: CreditAnalysisInput = {
  age: 18,
  monthlyIncome: 0,
  debtHistory: "limpo",
  loanAmount: 0,
};

interface SubmitResponse {
  log: CreditAnalysisLog;
}

export function CreditAnalysisForm() {
  const [formData, setFormData] = useState<CreditAnalysisInput>(initialForm);
  const [result, setResult] = useState<CreditAnalysisResult | null>(null);
  const [logs, setLogs] = useState<CreditAnalysisLog[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogs() {
      try {
        const response = await fetch(`${API_URL}/api/credit-analysis/logs`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar o historico.");
        }

        const data = (await response.json()) as { logs: CreditAnalysisLog[] };
        setLogs(data.logs);
      } catch (loadError) {
        console.error(loadError);
      }
    }

    loadLogs();
  }, []);

  function updateField<K extends keyof CreditAnalysisInput>(
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
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/credit-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message ?? "Falha ao analisar credito.");
      }

      const data = (await response.json()) as SubmitResponse;
      setResult(data.log.result);
      setLogs((current) => [data.log, ...current].slice(0, 10));
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Erro inesperado ao enviar a analise.";
      setError(message);
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="dashboard">
      <section className="panel hero-panel">
        <div>
          <p className="eyebrow">Analise automatizada de credito</p>
          <h1>Decida rapidamente se o emprestimo deve ser aprovado.</h1>
          <p className="hero-copy">
            Informe os dados do cliente, avalie as regras de negocio e mantenha
            o historico completo das analises registradas.
          </p>
        </div>

        <div className="rule-list">
          <div>
            <strong>Regra 1</strong>
            <span>Cliente deve ter 18 anos ou mais.</span>
          </div>
          <div>
            <strong>Regra 2</strong>
            <span>Parcela em 12x nao pode ultrapassar 30% da renda.</span>
          </div>
          <div>
            <strong>Regra 3</strong>
            <span>Historico de dividas precisa estar limpo.</span>
          </div>
        </div>
      </section>

      <div className="content-grid">
        <section className="panel">
          <h2>Formulario do cliente</h2>
          <form className="credit-form" onSubmit={handleSubmit}>
            <label>
              Idade
              <input
                min={0}
                type="number"
                value={formData.age}
                onChange={(event) => updateField("age", Number(event.target.value))}
                required
              />
            </label>

            <label>
              Renda mensal
              <input
                min={0}
                step="0.01"
                type="number"
                value={formData.monthlyIncome}
                onChange={(event) =>
                  updateField("monthlyIncome", Number(event.target.value))
                }
                required
              />
            </label>

            <label>
              Historico de dividas
              <select
                value={formData.debtHistory}
                onChange={(event) =>
                  updateField("debtHistory", event.target.value as DebtHistory)
                }
              >
                <option value="limpo">Limpo</option>
                <option value="negativado">Negativado</option>
              </select>
            </label>

            <label>
              Valor do emprestimo solicitado
              <input
                min={0}
                step="0.01"
                type="number"
                value={formData.loanAmount}
                onChange={(event) =>
                  updateField("loanAmount", Number(event.target.value))
                }
                required
              />
            </label>

            <button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Analisando..." : "Analisar credito"}
            </button>
          </form>

          {error ? <p className="error-box">{error}</p> : null}
        </section>

        <section className="panel result-panel">
          <h2>Resultado da analise</h2>
          {result ? (
            <div className="result-card">
              <span
                className={`status-pill ${result.approved ? "approved" : "rejected"}`}
              >
                {result.status}
              </span>
              <dl>
                <div>
                  <dt>Parcela mensal</dt>
                  <dd>{formatCurrency(result.monthlyInstallment)}</dd>
                </div>
                <div>
                  <dt>Comprometimento da renda</dt>
                  <dd>{formatPercentage(result.commitmentRate)}</dd>
                </div>
                <div>
                  <dt>Data da analise</dt>
                  <dd>{formatDateTime(result.timestamp)}</dd>
                </div>
              </dl>

              <div>
                <h3>Motivos</h3>
                {result.reasons.length > 0 ? (
                  <ul>
                    {result.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Todas as condicoes foram atendidas.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="empty-state">
              O parecer aparecerá aqui como <strong>Aprovado</strong> ou{" "}
              <strong>Reprovado</strong> apos o envio do formulario.
            </p>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="section-header">
          <h2>Ultimas analises registradas</h2>
          <span>{logs.length} itens carregados</span>
        </div>

        {logs.length > 0 ? (
          <div className="log-list">
            {logs.map((log) => (
              <article className="log-card" key={log.id}>
                <header>
                  <span
                    className={`status-pill ${
                      log.result.approved ? "approved" : "rejected"
                    }`}
                  >
                    {log.result.status}
                  </span>
                  <time>{formatDateTime(log.createdAt)}</time>
                </header>

                <p>
                  Cliente com {log.customer.age} anos, renda de{" "}
                  {formatCurrency(log.customer.monthlyIncome)} e emprestimo de{" "}
                  {formatCurrency(log.customer.loanAmount)}.
                </p>
                <p>Historico informado: {log.customer.debtHistory}.</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">
            Nenhuma analise foi registrada ainda. Assim que voce enviar o
            formulario, o historico aparecera aqui.
          </p>
        )}
      </section>
    </div>
  );
}
