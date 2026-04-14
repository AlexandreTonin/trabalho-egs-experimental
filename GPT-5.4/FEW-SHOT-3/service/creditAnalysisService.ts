import { calculateIncomeCommitment, calculateInstallment } from "@/utils/calculation";
import { CreditAnalysisInput, CreditAnalysisResult } from "@/types/credit";
import { validateAdultAge } from "@/validation/creditValidation";

const INSTALLMENT_MONTHS = 12;
const MAX_INCOME_COMMITMENT = 0.3;

export function processCreditAnalysis(
  input: CreditAnalysisInput
): CreditAnalysisResult {
  const installmentAmount = calculateInstallment(
    input.loanAmount,
    INSTALLMENT_MONTHS
  );
  const incomeCommitmentRatio = calculateIncomeCommitment(
    installmentAmount,
    input.monthlyIncome
  );
  const isAdult = validateAdultAge(input.age);
  const hasCleanDebtHistory = input.debtHistory === "limpo";
  const incomeSupportsInstallment =
    incomeCommitmentRatio <= MAX_INCOME_COMMITMENT;

  const reasons: string[] = [];

  if (!isAdult) {
    reasons.push("Cliente menor de idade.");
  }

  if (!incomeSupportsInstallment) {
    reasons.push(
      "A parcela em 12 meses compromete mais de 30% da renda mensal."
    );
  }

  if (!hasCleanDebtHistory) {
    reasons.push("Cliente com histórico de dívidas negativado.");
  }

  const approved =
    isAdult && hasCleanDebtHistory && incomeSupportsInstallment;

  return {
    approved,
    message: approved ? "Crédito aprovado" : "Crédito reprovado",
    reasons:
      reasons.length > 0
        ? reasons
        : ["Cliente atende a todas as regras de elegibilidade."],
    breakdown: {
      installmentAmount,
      incomeCommitmentRatio,
      maxAllowedInstallment: input.monthlyIncome * MAX_INCOME_COMMITMENT,
      isAdult,
      hasCleanDebtHistory,
      incomeSupportsInstallment
    }
  };
}
