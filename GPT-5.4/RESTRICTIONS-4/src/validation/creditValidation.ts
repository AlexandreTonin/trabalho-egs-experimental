import { CreditRequest } from "@/types/credit";

// Camada Validation: centraliza as validações e retorna mensagens reutilizáveis.
export function validateAdultAge(age: number) {
  return age >= 18 ? "" : "O cliente precisa ter 18 anos ou mais.";
}

export function validatePositiveIncome(monthlyIncome: number) {
  return monthlyIncome > 0 ? "" : "A renda mensal deve ser maior que zero.";
}

export function validatePositiveLoanAmount(loanAmount: number) {
  return loanAmount > 0 ? "" : "O valor do empréstimo deve ser maior que zero.";
}

export function validateDebtHistory(debtHistory: CreditRequest["debtHistory"]) {
  return debtHistory === "limpo" ? "" : "O histórico de dívidas possui restrições.";
}

export function validateIncomeCommitment(rate: number) {
  return rate <= 0.3 ? "" : "A parcela compromete mais de 30% da renda mensal.";
}

export function collectValidationMessages(messages: string[]) {
  return messages.filter(Boolean);
}

export function validateCreditRequest(request: CreditRequest, rate: number) {
  const messages = [
    validateAdultAge(request.age),
    validatePositiveIncome(request.monthlyIncome),
    validatePositiveLoanAmount(request.loanAmount),
    validateDebtHistory(request.debtHistory),
    validateIncomeCommitment(rate),
  ];
  return collectValidationMessages(messages);
}
