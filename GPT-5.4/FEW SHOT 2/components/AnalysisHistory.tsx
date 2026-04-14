"use client";

import type { CreditLogEntry } from "@/types/credit";

type AnalysisHistoryProps = {
  logs: CreditLogEntry[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

export function AnalysisHistory({ logs }: AnalysisHistoryProps) {
  return (
    <aside className="panel history-panel">
      <h2>Histórico de análises</h2>
      <p className="hint">
        Cada avaliação é registrada com data, dados do cliente e resultado final.
      </p>

      {logs.length === 0 ? (
        <p className="empty-state">
          Nenhuma análise foi registrada ainda. Envie o formulário para começar a gerar logs.
        </p>
      ) : (
        <div className="history-list">
          {logs.map((log, index) => (
            <article className="history-item" key={`${log.createdAt}-${index}`}>
              <header>
                <div>
                  <h3>{log.result.approved ? "Aprovado" : "Reprovado"}</h3>
                  <time dateTime={log.createdAt}>{formatDate(log.createdAt)}</time>
                </div>
                <span
                  className={`result-badge ${log.result.approved ? "approved" : "rejected"}`}
                >
                  {log.result.approved ? "Aprovado" : "Reprovado"}
                </span>
              </header>

              <dl className="history-meta">
                <div>
                  <dt>Idade</dt>
                  <dd>{log.customer.age} anos</dd>
                </div>
                <div>
                  <dt>Renda</dt>
                  <dd>{formatCurrency(log.customer.monthlyIncome)}</dd>
                </div>
                <div>
                  <dt>Histórico</dt>
                  <dd>{log.customer.debtHistory}</dd>
                </div>
                <div>
                  <dt>Empréstimo</dt>
                  <dd>{formatCurrency(log.customer.requestedAmount)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </aside>
  );
}
