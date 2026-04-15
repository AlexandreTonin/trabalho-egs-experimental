import { AnalysisRequest, AnalysisResponse } from "@/types/credit";

const INSTALLMENT_COUNT = 12;
const MAX_INCOME_COMMITMENT = 30;

export function analyzeCredit(data: AnalysisRequest): AnalysisResponse {
  const monthlyInstallment = data.requestedLoanAmount / INSTALLMENT_COUNT;
  const incomeCommitmentPercentage =
    data.monthlyIncome > 0
      ? (monthlyInstallment / data.monthlyIncome) * 100
      : Number.POSITIVE_INFINITY;

  const isAdult = data.age >= 18;
  const hasHealthyDebtHistory = data.debtHistory === "clean";
  const hasHealthyIncomeCommitment =
    incomeCommitmentPercentage <= MAX_INCOME_COMMITMENT;

  const approved =
    isAdult && hasHealthyDebtHistory && hasHealthyIncomeCommitment;

  const reasons = [
    isAdult
      ? "Cliente possui 18 anos ou mais."
      : "Cliente menor de 18 anos.",
    hasHealthyDebtHistory
      ? "Histórico de dívidas está limpo."
      : "Cliente possui histórico negativado.",
    hasHealthyIncomeCommitment
      ? "Parcela compromete até 30% da renda mensal."
      : "Parcela compromete mais de 30% da renda mensal."
  ];

  return {
    approved,
    monthlyInstallment,
    incomeCommitmentPercentage,
    reasons
  };
}
