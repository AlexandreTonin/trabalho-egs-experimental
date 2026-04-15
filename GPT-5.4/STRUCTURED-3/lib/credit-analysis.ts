import { AnalysisRequest, AnalysisResponse } from "@/types/credit";

const INSTALLMENT_COUNT = 12;
const MAX_INCOME_COMMITMENT = 30;

export function analyzeCredit(data: AnalysisRequest): AnalysisResponse {
  const monthlyInstallment = data.requestedLoanAmount / INSTALLMENT_COUNT;
  const incomeCommitmentPercentage =
    (monthlyInstallment / data.monthlyIncome) * 100;

  const isAdult = data.age >= 18;
  const hasHealthyIncomeCommitment =
    incomeCommitmentPercentage <= MAX_INCOME_COMMITMENT;
  const hasHealthyDebtHistory = data.debtHistory === "clean";

  const approved =
    isAdult && hasHealthyIncomeCommitment && hasHealthyDebtHistory;

  return {
    approved,
    monthlyInstallment,
    incomeCommitmentPercentage,
    reasons: [
      isAdult
        ? "Cliente possui 18 anos ou mais."
        : "Cliente tem menos de 18 anos.",
      hasHealthyIncomeCommitment
        ? "A parcela compromete no maximo 30% da renda mensal."
        : "A parcela compromete mais de 30% da renda mensal.",
      hasHealthyDebtHistory
        ? "Historico de dividas esta limpo."
        : "Cliente possui historico de dividas negativado."
    ]
  };
}
