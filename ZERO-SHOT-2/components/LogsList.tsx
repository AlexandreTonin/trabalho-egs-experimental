import type { AnalysisLogEntry } from "@/lib/credit-analysis";

type LogsListProps = {
  isLoading: boolean;
  logs: AnalysisLogEntry[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(timestamp));
}

export function LogsList({ isLoading, logs }: LogsListProps) {
  return (
    <section className="logs-card">
      <h2>Ultimas analises registradas</h2>
      <p>
        Cada envio gera um log com data, hora, dados informados e resultado final da
        avaliacao.
      </p>

      {isLoading ? <p>Carregando historico...</p> : null}

      {!isLoading && logs.length === 0 ? (
        <p>Nenhum log encontrado ainda. Envie a primeira analise para criar o historico.</p>
      ) : null}

      <div className="logs-list">
        {logs.map((entry) => (
          <article className="log-item" key={entry.id}>
            <p>
              <strong>{entry.result}</strong> em {formatTimestamp(entry.timestamp)}
            </p>
            <p>
              Idade: {entry.customer.age} | Renda: {formatCurrency(entry.customer.monthlyIncome)}
            </p>
            <p>
              Historico: {entry.customer.debtHistory} | Emprestimo:{" "}
              {formatCurrency(entry.customer.loanAmount)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
