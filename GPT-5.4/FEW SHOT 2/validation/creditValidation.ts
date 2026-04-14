import type { CreditAnalysisInput, DebtHistory } from "@/types/credit";

const VALID_DEBT_HISTORY: DebtHistory[] = ["limpo", "negativado"];

export function validateRequiredCreditFields(data: CreditAnalysisInput): string[] {
  const errors: string[] = [];

  if (Number.isNaN(data.age) || data.age <= 0) {
    errors.push("Informe uma idade válida.");
  }

  if (Number.isNaN(data.monthlyIncome) || data.monthlyIncome <= 0) {
    errors.push("Informe uma renda mensal válida.");
  }

  if (Number.isNaN(data.requestedAmount) || data.requestedAmount <= 0) {
    errors.push("Informe um valor de empréstimo válido.");
  }

  if (!VALID_DEBT_HISTORY.includes(data.debtHistory)) {
    errors.push("Selecione um histórico de dívidas válido.");
  }

  return errors;
}

export function validateDebtHistory(debtHistory: DebtHistory): boolean {
  return debtHistory === "limpo";
}
