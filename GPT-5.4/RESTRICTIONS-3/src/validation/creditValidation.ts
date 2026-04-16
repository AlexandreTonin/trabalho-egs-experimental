import { CreditFormData, DebtHistory, ValidationResult } from "@/types/credit";

// Validation layer: centraliza todas as verificacoes de entrada.
export function validateCreditInput(data: CreditFormData): ValidationResult {
  const errors = [
    validateAgeValue(data.idade),
    validateMoneyValue("renda mensal", data.rendaMensal),
    validateMoneyValue("valor do emprestimo", data.valorEmprestimo),
    validateDebtHistoryValue(data.historicoDividas),
  ];
  return { isValid: filterErrors(errors).length === 0, errors: filterErrors(errors) };
}

function validateAgeValue(age: number) {
  return Number.isFinite(age) && age > 0 ? null : "Informe uma idade valida.";
}

function validateMoneyValue(label: string, value: number) {
  return Number.isFinite(value) && value > 0 ? null : `Informe ${label} valida.`;
}

function validateDebtHistoryValue(history: DebtHistory) {
  return ["limpo", "negativado"].includes(history) ? null : "Informe um historico valido.";
}

function filterErrors(errors: Array<string | null>) {
  return errors.filter((error): error is string => Boolean(error));
}
