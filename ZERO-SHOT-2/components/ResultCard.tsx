import type { CreditAnalysisResponse } from "@/lib/credit-analysis";

type ResultCardProps = {
  result: CreditAnalysisResponse;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ResultCard({ result }: ResultCardProps) {
  const isApproved = result.result === "Aprovado";

  return (
    <article className="result-card">
      <div
        className={`status-pill ${
          isApproved ? "status-approved" : "status-rejected"
        }`}
      >
        {result.result}
      </div>

      <p>{result.summary}</p>

      <div className="result-grid">
        <div className="metric">
          <span>Parcela mensal</span>
          <strong>{formatCurrency(result.monthlyInstallment)}</strong>
        </div>
        <div className="metric">
          <span>Comprometimento</span>
          <strong>{result.incomeCommitmentPercentage.toFixed(2)}%</strong>
        </div>
        <div className="metric">
          <span>Prazo considerado</span>
          <strong>{result.installments} parcelas</strong>
        </div>
      </div>

      <div>
        <p>Motivos da avaliacao:</p>
        <ul className="reasons-list">
          {result.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
