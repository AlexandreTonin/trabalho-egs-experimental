import { CreditAnalysisForm } from "@/components/CreditAnalysisForm";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Motor de decisão</span>
        <h1>Análise de crédito com regras claras e logs locais.</h1>
        <p>
          Esta aplicação separa interface, validação, regras de negócio e persistência para
          manter o fluxo de análise mais organizado. Ao enviar os dados do cliente, o sistema
          avalia maioridade, comprometimento de renda e histórico de dívidas, exibindo o
          resultado imediatamente e registrando cada análise no navegador.
        </p>
      </section>

      <CreditAnalysisForm />
    </main>
  );
}
