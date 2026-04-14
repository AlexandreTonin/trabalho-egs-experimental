import { CreditAnalysisForm } from "@/components/CreditAnalysisForm";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">Analise automatizada</span>
          <h1>Credito avaliado com regras claras e logs persistidos</h1>
          <p>
            Preencha os dados do cliente para verificar maioridade, impacto da parcela
            na renda e historico de restricoes financeiras.
          </p>
        </div>
        <CreditAnalysisForm />
      </section>
    </main>
  );
}
