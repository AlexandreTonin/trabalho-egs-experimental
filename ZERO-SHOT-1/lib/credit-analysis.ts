import {
  CreditAnalysisInput,
  CreditAnalysisResult,
  DebtHistory,
} from "@/lib/types";

const MINIMUM_AGE = 18;
const MAX_INCOME_COMMITMENT_RATIO = 0.3;
const INSTALLMENT_COUNT = 12;

export function normalizeDebtHistory(value: string): DebtHistory {
  return value === "negativado" ? "negativado" : "limpo";
}

export function analyzeCredit(input: CreditAnalysisInput): CreditAnalysisResult {
  // A simulacao considera 12 parcelas fixas, conforme o requisito do projeto.
  const monthlyInstallment = input.loanAmount / INSTALLMENT_COUNT;
  const installmentCommitmentRatio =
    input.monthlyIncome > 0 ? monthlyInstallment / input.monthlyIncome : Infinity;

  const conditions = {
    isAdult: input.age >= MINIMUM_AGE,
    hasCleanDebtHistory: input.debtHistory === "limpo",
    isInstallmentWithinIncomeLimit:
      installmentCommitmentRatio <= MAX_INCOME_COMMITMENT_RATIO,
    monthlyInstallment,
    installmentCommitmentRatio,
  };

  const isApproved =
    conditions.isAdult &&
    conditions.hasCleanDebtHistory &&
    conditions.isInstallmentWithinIncomeLimit;

  return {
    status: isApproved ? "Aprovado" : "Reprovado",
    message: isApproved
      ? "Cliente elegível com base nas regras atuais de análise."
      : "Cliente não atende a todos os critérios mínimos para aprovação.",
    conditions,
  };
}

export function validateCreditAnalysisInput(
  payload: Partial<Record<keyof CreditAnalysisInput, unknown>>,
): CreditAnalysisInput {
  const age = Number(payload.age);
  const monthlyIncome = Number(payload.monthlyIncome);
  const loanAmount = Number(payload.loanAmount);
  const debtHistory = normalizeDebtHistory(String(payload.debtHistory ?? "limpo"));

  if (!Number.isFinite(age) || age <= 0) {
    throw new Error("Informe uma idade válida.");
  }

  if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) {
    throw new Error("Informe uma renda mensal válida.");
  }

  if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
    throw new Error("Informe um valor de empréstimo válido.");
  }

  // O payload e normalizado aqui para manter a interface separada das regras.
  return {
    age,
    monthlyIncome,
    debtHistory,
    loanAmount,
  };
}
