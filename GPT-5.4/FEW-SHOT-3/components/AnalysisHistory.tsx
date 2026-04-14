import { AnalysisLogEntry } from "@/types/credit";
import { formatDateTime } from "@/utils/date";

type AnalysisHistoryProps = {
  logs: AnalysisLogEntry[];
};

export function AnalysisHistory({ logs }: AnalysisHistoryProps) {
  return (
    <section className="panel">
      <h2>Histórico de análises</h2>
      <p className="helper">
        Cada submissão é registrada em arquivo JSON por meio da rota de API do
        Next.js.
      </p>

      {logs.length === 0 ? (
        <p className="empty-state">Nenhuma análise registrada até o momento.</p>
      ) : (
        <div className="history-list">
          {logs.map((log) => (
            <article key={log.id} className="history-item">
              <div className="inline-info">
                <strong>
                  {log.result.approved ? "Aprovado" : "Reprovado"}
                </strong>
                <small>{formatDateTime(log.createdAt)}</small>
              </div>

              <small>
                Idade: {log.customer.age} | Renda: R${" "}
                {log.customer.monthlyIncome.toFixed(2).replace(".", ",")} |
                Histórico: {log.customer.debtHistory} | Empréstimo: R${" "}
                {log.customer.loanAmount.toFixed(2).replace(".", ",")}
              </small>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
