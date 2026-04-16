import { CreditAnalysisResult } from "@/types/credit";

type CreditResultCardProps = {
  result: CreditAnalysisResult | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatPercentage(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" }).format(new Date(value));
}

function ResultMetrics({ result }: CreditResultCardProps) {
  return <div className="metrics"><div className="metric"><span>Parcela em 12x</span><strong>{formatCurrency(result!.installmentAmount)}</strong></div><div className="metric"><span>Comprometimento</span><strong>{formatPercentage(result!.commitmentRate)}</strong></div><div className="metric"><span>Data da análise</span><strong>{formatDate(result!.analyzedAt)}</strong></div></div>;
}

function ResultReasons({ result }: CreditResultCardProps) {
  const reasons = result!.reasons.length ? result!.reasons : ["Todas as validações foram atendidas."];
  return <div><strong>Motivos</strong><ul className="result-list">{reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>;
}

export function CreditResultCard({ result }: CreditResultCardProps) {
  if (!result) {
    return <p className="helper-text">Nenhuma análise foi executada ainda.</p>;
  }

  const statusClass = result.approved ? "approved" : "rejected";
  const cardClass = `result-card result-card--${statusClass}`;
  const pillClass = `status-pill status-pill--${statusClass}`;
  return <article className={cardClass}><span className={pillClass}>{result.status}</span><ResultMetrics result={result} /><ResultReasons result={result} /></article>;
}
