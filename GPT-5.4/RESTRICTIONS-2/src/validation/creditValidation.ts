import { CustomerData, DebtHistory } from "@/types/credit";

// Validation layer: centraliza validacoes de entrada sem regras de aprovacao.
export function isAdult(age: number) {
  return age >= 18;
}

export function isPositiveNumber(value: number) {
  return Number.isFinite(value) && value > 0;
}

export function isDebtHistory(value: string): value is DebtHistory {
  return value === "limpo" || value === "negativado";
}

export function validateAge(age: number) {
  return isPositiveNumber(age) ? [] : ["Informe uma idade valida."];
}

export function validateIncome(income: number) {
  return isPositiveNumber(income) ? [] : ["Informe uma renda mensal valida."];
}

export function validateLoanAmount(amount: number) {
  return isPositiveNumber(amount) ? [] : ["Informe um valor de emprestimo valido."];
}

export function validateDebtHistory(history: string) {
  return isDebtHistory(history) ? [] : ["Selecione um historico de dividas valido."];
}

export function validateCustomerData(data: CustomerData) {
  return [
    ...validateAge(data.age),
    ...validateIncome(data.monthlyIncome),
    ...validateLoanAmount(data.requestedLoan),
    ...validateDebtHistory(data.debtHistory)
  ];
}
