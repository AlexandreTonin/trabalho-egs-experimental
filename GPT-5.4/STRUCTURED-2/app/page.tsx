import { CreditAnalysisForm } from "@/components/credit-analysis-form";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">Sistema Financeiro</span>
          <h1>Análise de crédito com regras claras e rastreáveis.</h1>
          <p>
            Preencha os dados do cliente para avaliar aprovação de crédito com
            base na renda, idade, histórico de dívidas e parcela fixa em 12x.
          </p>
        </div>

        <CreditAnalysisForm />
      </section>
    </main>
  );
}
