import { CreditAnalysisInput } from "@/types/credit";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateCreditAnalysisInput(
  input: CreditAnalysisInput
): ValidationResult {
  const errors: string[] = [];

  if (!Number.isFinite(input.age) || input.age <= 0) {
    errors.push("A idade deve ser um número maior que zero.");
  }

  if (!Number.isFinite(input.monthlyIncome) || input.monthlyIncome <= 0) {
    errors.push("A renda mensal deve ser maior que zero.");
  }

  if (!Number.isFinite(input.loanAmount) || input.loanAmount <= 0) {
    errors.push("O valor do empréstimo deve ser maior que zero.");
  }

  if (!["limpo", "negativado"].includes(input.debtHistory)) {
    errors.push("O histórico de dívidas informado é inválido.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateAdultAge(age: number): boolean {
  return age >= 18;
}
