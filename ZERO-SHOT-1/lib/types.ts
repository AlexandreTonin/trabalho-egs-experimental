export type DebtHistory = "limpo" | "negativado";

export interface CreditAnalysisInput {
  age: number;
  monthlyIncome: number;
  debtHistory: DebtHistory;
  loanAmount: number;
}

export interface CreditAnalysisConditions {
  isAdult: boolean;
  hasCleanDebtHistory: boolean;
  isInstallmentWithinIncomeLimit: boolean;
  monthlyInstallment: number;
  installmentCommitmentRatio: number;
}

export interface CreditAnalysisResult {
  status: "Aprovado" | "Reprovado";
  message: string;
  conditions: CreditAnalysisConditions;
}

export interface CreditAnalysisLogEntry {
  createdAt: string;
  input: CreditAnalysisInput;
  result: CreditAnalysisResult;
}
