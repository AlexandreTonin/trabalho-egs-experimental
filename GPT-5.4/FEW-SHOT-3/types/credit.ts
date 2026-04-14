export type DebtHistory = "limpo" | "negativado";

export type CreditAnalysisInput = {
  age: number;
  monthlyIncome: number;
  debtHistory: DebtHistory;
  loanAmount: number;
};

export type CreditAnalysisBreakdown = {
  installmentAmount: number;
  incomeCommitmentRatio: number;
  maxAllowedInstallment: number;
  isAdult: boolean;
  hasCleanDebtHistory: boolean;
  incomeSupportsInstallment: boolean;
};

export type CreditAnalysisResult = {
  approved: boolean;
  message: string;
  reasons: string[];
  breakdown: CreditAnalysisBreakdown;
};

export type AnalysisLogEntry = {
  id: string;
  createdAt: string;
  customer: CreditAnalysisInput;
  result: CreditAnalysisResult;
};
