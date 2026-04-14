import { CreditAnalysisInput, CreditAnalysisResult } from "@/types/credit";
import { calculateIncomeCommitment, calculateInstallment } from "@/utils/calculation";
import { validatePositiveNumber, validateDebtHistoryStatus } from "@/validation/creditValidation";
import { validateUserAge } from "@/validation/userValidation";

const INSTALLMENT_MONTHS = 12;
const MAX_INCOME_COMMITMENT = 0.3;

export function analyzeCredit(input: CreditAnalysisInput): CreditAnalysisResult {
  const reasons: string[] = [];

  if (!validatePositiveNumber(input.age) || !validateUserAge(input.age)) {
    reasons.push("O cliente precisa ter 18 anos ou mais.");
  }

  if (!validatePositiveNumber(input.monthlyIncome)) {
    reasons.push("A renda mensal deve ser maior que zero.");
  }

  if (!validatePositiveNumber(input.loanAmount)) {
    reasons.push("O valor do empréstimo deve ser maior que zero.");
  }

  if (!validateDebtHistoryStatus(input.debtHistory)) {
    reasons.push("O histórico de dívidas informado é inválido.");
  }

  const installmentAmount =
    validatePositiveNumber(input.loanAmount) && validatePositiveNumber(INSTALLMENT_MONTHS)
      ? calculateInstallment(input.loanAmount, INSTALLMENT_MONTHS)
      : 0;

  const incomeCommitmentRatio =
    validatePositiveNumber(input.monthlyIncome) && installmentAmount > 0
      ? calculateIncomeCommitment(installmentAmount, input.monthlyIncome)
      : 0;

  if (incomeCommitmentRatio > MAX_INCOME_COMMITMENT) {
    reasons.push("A parcela compromete mais de 30% da renda mensal.");
  }

  if (input.debtHistory === "negativado") {
    reasons.push("O cliente possui restrições no histórico de dívidas.");
  }

  const approved = reasons.length === 0;

  return {
    approved,
    message: approved ? "Aprovado" : "Reprovado",
    installmentAmount,
    incomeCommitmentRatio,
    reasons,
  };
}

export function getAnalysisRules() {
  return {
    installmentMonths: INSTALLMENT_MONTHS,
    maxIncomeCommitment: MAX_INCOME_COMMITMENT,
  };
}
