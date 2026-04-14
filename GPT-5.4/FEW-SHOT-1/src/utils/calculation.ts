export function calculateInstallment(amount: number, months: number): number {
  return amount / months;
}

export function calculateIncomeCommitment(installmentAmount: number, monthlyIncome: number): number {
  return installmentAmount / monthlyIncome;
}
