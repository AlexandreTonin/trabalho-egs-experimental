import { CreditLog } from '@/types/credit';

type LogListProps = {
  logs: CreditLog[];
};

// Camada UI: mostra os registros persistidos recebidos do repository.
export function LogList({ logs }: LogListProps) {
  return <section className="panel"><h2 className="section-title">Logs das analises</h2><p className="helper-text">Cada envio gera um registro com data, cliente e resultado.</p>{logs.length === 0 ? <p className="log-empty">Nenhum log registrado ainda.</p> : <LogCards logs={logs} />}</section>;
}

function LogCards({ logs }: LogListProps) {
  return <div className="log-list">{logs.map((log) => <LogCard key={`${log.createdAt}-${log.customerData.loanAmount}`} log={log} />)}</div>;
}

function formatDateTime(dateTime: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(dateTime));
}

function LogCard({ log }: { log: CreditLog }) {
  return <article className="log-card"><p>Data/Hora: {formatDateTime(log.createdAt)}</p><p>Idade: {log.customerData.age}</p><p>Renda mensal: R$ {log.customerData.monthlyIncome.toFixed(2)}</p><p>Historico: {log.customerData.debtHistory}</p><p>Emprestimo: R$ {log.customerData.loanAmount.toFixed(2)}</p><p>Resultado: {log.analysisResult.status}</p></article>;
}
