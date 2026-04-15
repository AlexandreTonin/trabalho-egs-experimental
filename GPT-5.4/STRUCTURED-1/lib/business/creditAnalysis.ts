import type { CreditAnalysisResult, CreditFormData } from "@/types/credit";

const TOTAL_INSTALLMENTS = 12;
const MAX_INCOME_COMMITMENT = 0.3;

export function analyzeCredit(data: CreditFormData): CreditAnalysisResult {
  const parcelaMensal = data.valorEmprestimo / TOTAL_INSTALLMENTS;
  const percentualComprometido = parcelaMensal / data.rendaMensal;
  const motivos: string[] = [];

  if (data.idade < 18) {
    motivos.push("Cliente deve ter pelo menos 18 anos.");
  }

  if (percentualComprometido > MAX_INCOME_COMMITMENT) {
    motivos.push("Parcela compromete mais de 30% da renda mensal.");
  }

  if (data.historicoDividas === "negativado") {
    motivos.push("Cliente possui histórico de dívidas negativado.");
  }

  return {
    aprovado: motivos.length === 0,
    parcelaMensal,
    percentualComprometido,
    motivos
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}
