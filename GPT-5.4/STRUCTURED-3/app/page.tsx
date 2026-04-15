import { CreditAnalysisForm } from "@/components/credit-analysis-form";
import { readAnalysisLogs } from "@/lib/log-storage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const logs = await readAnalysisLogs();
  const latestLogs = logs.slice(0, 5);

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Sistema Financeiro</span>
          <h1>Avalie pedidos de credito com regras claras e historico auditavel.</h1>
          <p>
            Informe idade, renda, historico de dividas e valor do emprestimo.
            A aplicacao calcula a parcela fixa em 12x, aplica as regras de
            negocio e registra cada analise em log.
          </p>
        </div>

        <CreditAnalysisForm latestLogs={latestLogs} />
      </section>
    </main>
  );
}
