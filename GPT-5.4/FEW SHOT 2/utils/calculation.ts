export function calculateInstallment(amount: number, months: number): number {
  return amount / months;
}

export function calculateCommitmentRate(installment: number, monthlyIncome: number): number {
  return (installment / monthlyIncome) * 100;
}
