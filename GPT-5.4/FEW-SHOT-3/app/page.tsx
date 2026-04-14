import { CreditAnalysisForm } from "@/components/CreditAnalysisForm";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Next.js + TypeScript</span>
        <h1>Análise de crédito com regras de negócio e persistência de logs</h1>
        <p>
          Preencha os dados do cliente para validar elegibilidade, calcular o
          comprometimento de renda e registrar cada análise realizada.
        </p>
      </section>

      <CreditAnalysisForm />
    </main>
  );
}
