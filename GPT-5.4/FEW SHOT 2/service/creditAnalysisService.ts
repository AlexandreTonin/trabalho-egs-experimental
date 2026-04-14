import { calculateCommitmentRate, calculateInstallment } from "@/utils/calculation";
import { validateRequiredCreditFields, validateDebtHistory } from "@/validation/creditValidation";
import { validateUserAge } from "@/validation/userValidation";
import type { CreditAnalysisInput, CreditAnalysisResult } from "@/types/credit";

const INSTALLMENT_MONTHS = 12;
const MAX_COMMITMENT_RATE = 30;

export function processCreditAnalysis(data: CreditAnalysisInput): CreditAnalysisResult {
  const validationErrors = validateRequiredCreditFields(data);

  if (validationErrors.length > 0) {
    return {
      approved: false,
      message: "Dados inválidos para a análise de crédito.",
      monthlyInstallment: 0,
      commitmentRate: 0,
      reasons: validationErrors
    };
  }

  const monthlyInstallment = calculateInstallment(data.requestedAmount, INSTALLMENT_MONTHS);
  const commitmentRate = calculateCommitmentRate(monthlyInstallment, data.monthlyIncome);
  const isAdult = validateUserAge(data.age);
  const hasCleanDebtHistory = validateDebtHistory(data.debtHistory);
  const respectsIncomeLimit = commitmentRate <= MAX_COMMITMENT_RATE;
  const reasons: string[] = [];

  if (!isAdult) {
    reasons.push("Cliente menor de idade.");
  }

  if (!respectsIncomeLimit) {
    reasons.push("A parcela compromete mais de 30% da renda mensal.");
  }

  if (!hasCleanDebtHistory) {
    reasons.push("Cliente possui histórico de dívidas negativado.");
  }

  const approved = isAdult && respectsIncomeLimit && hasCleanDebtHistory;

  return {
    approved,
    message: approved ? "Crédito aprovado." : "Crédito reprovado.",
    monthlyInstallment,
    commitmentRate,
    reasons
  };
}

export const creditPolicy = {
  installmentMonths: INSTALLMENT_MONTHS,
  maxCommitmentRate: MAX_COMMITMENT_RATE
};
