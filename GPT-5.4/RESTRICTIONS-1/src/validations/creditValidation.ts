import { CreditFormData } from '@/types/credit';

// Camada Validation: concentra validacoes simples e reutilizaveis.
export function validateCreditData(data: CreditFormData) {
  return [
    validateAdultAge(data.age),
    validatePositiveIncome(data.monthlyIncome),
    validatePositiveLoanAmount(data.loanAmount),
  ].filter(Boolean);
}

export function validateAdultAge(age: number) {
  return age >= 18 ? '' : 'O cliente deve ter 18 anos ou mais.';
}

export function validatePositiveIncome(monthlyIncome: number) {
  return monthlyIncome > 0 ? '' : 'A renda mensal deve ser maior que zero.';
}

export function validatePositiveLoanAmount(loanAmount: number) {
  return loanAmount > 0 ? '' : 'O valor do emprestimo deve ser maior que zero.';
}
