import { CreditAnalysisResult } from '@/types/credit';

type AnalysisResultProps = {
  result: CreditAnalysisResult | null;
};

// Camada UI: apresenta o retorno pronto do service sem recalcular regras.
export function AnalysisResult({ result }: AnalysisResultProps) {
  return result ? <FilledResult result={result} /> : <EmptyResult />;
}

function getResultClassName(status: CreditAnalysisResult['status']) {
  return status === 'Aprovado' ? 'result-card' : 'result-card result-card--rejected';
}

function EmptyResult() {
  return <section className="panel"><h2 className="section-title">Resultado</h2><p className="helper-text">Envie os dados para visualizar se o credito foi aprovado.</p></section>;
}

function FilledResult({ result }: { result: CreditAnalysisResult }) {
  return <section className="panel"><h2 className="section-title">Resultado</h2><div className={getResultClassName(result.status)}><p className="result-status">{result.status}</p><p className="result-summary">Parcela fixa em 12x: R$ {result.installmentAmount.toFixed(2)}</p><ReasonList reasons={result.reasons} /></div></section>;
}

function ReasonList({ reasons }: { reasons: string[] }) {
  return <>{reasons.map((reason) => <p className="result-detail" key={reason}>{reason}</p>)}</>;
}
