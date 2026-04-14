import { CreditAnalysisResult } from "@/types/credit";

type AnalysisResultCardProps = {
  result: CreditAnalysisResult;
};

export function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  return (
    <section className="result-card" aria-live="polite">
      <span
        className={`status-pill ${
          result.approved ? "status-approved" : "status-rejected"
        }`}
      >
        {result.approved ? "Aprovado" : "Reprovado"}
      </span>

      <h3>{result.message}</h3>

      <div className="metric-list">
        <div className="metric-item">
          <strong>Parcela estimada em 12x</strong>
          <span>
            R$ {result.breakdown.installmentAmount.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <div className="metric-item">
          <strong>Comprometimento da renda</strong>
          <span>
            {(result.breakdown.incomeCommitmentRatio * 100)
              .toFixed(2)
              .replace(".", ",")}
            %
          </span>
        </div>

        <div className="metric-item">
          <strong>Limite máximo permitido</strong>
          <span>
            R$ {result.breakdown.maxAllowedInstallment.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      <div className="reason-list">
        {result.reasons.map((reason) => (
          <div key={reason} className="metric-item">
            <strong>Regra avaliada</strong>
            <span>{reason}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
