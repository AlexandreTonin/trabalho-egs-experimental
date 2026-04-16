import { CreditLogEntry } from "@/types/credit";

type CreditLogsPanelProps = {
  logs: CreditLogEntry[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" }).format(new Date(value));
}

function LogItem({ log }: { log: CreditLogEntry }) {
  return <article className="log-item"><div className="log-item__header"><strong>{formatDate(log.timestamp)}</strong><span className="log-item__status">{log.result.status}</span></div><div className="log-item__row"><span>Idade: {log.customer.age}</span><span>Histórico: {log.customer.debtHistory}</span></div><div className="log-item__row"><span>Renda: {formatCurrency(log.customer.monthlyIncome)}</span><span>Empréstimo: {formatCurrency(log.customer.loanAmount)}</span></div></article>;
}

export function CreditLogsPanel({ logs }: CreditLogsPanelProps) {
  if (logs.length === 0) {
    return <p className="helper-text">Os logs aparecerão aqui depois da primeira análise.</p>;
  }

  return <div className="log-list">{logs.map((log) => <LogItem key={`${log.timestamp}-${log.customer.age}-${log.customer.loanAmount}`} log={log} />)}</div>;
}
