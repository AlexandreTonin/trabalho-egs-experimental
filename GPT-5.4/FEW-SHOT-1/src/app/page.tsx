"use client";

import { CreditAnalysisForm } from "@/components/CreditAnalysisForm";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Next.js 16.2.3</span>
        <h1>Plataforma de análise de crédito</h1>
        <p>
          Aplicação web modular para validar elegibilidade, calcular comprometimento de renda
          e registrar logs das análises realizadas.
        </p>
      </section>

      <CreditAnalysisForm />
    </main>
  );
}
