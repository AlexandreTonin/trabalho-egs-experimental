import { CreditAnalysisForm } from "@/components/CreditAnalysisForm";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero__content">
          <span className="badge">Sistema Financeiro</span>
          <h1>Análise de crédito com regras claras e resultado imediato.</h1>
          <p>
            Preencha os dados do cliente para verificar se a solicitação atende
            aos critérios mínimos de aprovação.
          </p>
        </div>
      </section>

      <section className="content">
        <CreditAnalysisForm />
      </section>
    </main>
  );
}
