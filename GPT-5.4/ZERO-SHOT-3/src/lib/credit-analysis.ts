import { CreditAnalysisInput, CreditAnalysisResult } from "../types/credit";

const FIXED_INSTALLMENTS = 12;
const MAX_COMMITMENT_RATE = 0.3;
const MINIMUM_AGE = 18;

export function analyzeCredit(
  input: CreditAnalysisInput,
): CreditAnalysisResult {
  const reasons: string[] = [];
  const monthlyInstallment = input.loanAmount / FIXED_INSTALLMENTS;
  const commitmentRate =
    input.monthlyIncome > 0 ? monthlyInstallment / input.monthlyIncome : Infinity;

  if (input.age < MINIMUM_AGE) {
    reasons.push("Cliente menor de idade.");
  }

  if (commitmentRate > MAX_COMMITMENT_RATE) {
    reasons.push("Parcela compromete mais de 30% da renda mensal.");
  }

  if (input.debtHistory === "negativado") {
    reasons.push("Cliente possui restricoes no historico de dividas.");
  }

  return {
    approved: reasons.length === 0,
    status: reasons.length === 0 ? "Aprovado" : "Reprovado",
    timestamp: new Date().toISOString(),
    fixedInstallments: FIXED_INSTALLMENTS,
    monthlyInstallment,
    commitmentRate,
    reasons,
  };
}
