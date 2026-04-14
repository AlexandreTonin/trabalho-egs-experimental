export type DebtHistoryStatus = "limpo" | "negativado";

export interface CreditAnalysisInput {
  age: number;
  monthlyIncome: number;
  debtHistory: DebtHistoryStatus;
  loanAmount: number;
}

export interface CreditAnalysisResult {
  approved: boolean;
  message: string;
  installmentAmount: number;
  incomeCommitmentRatio: number;
  reasons: string[];
}

export interface CreditAnalysisLog {
  createdAt: string;
  input: CreditAnalysisInput;
  result: CreditAnalysisResult;
}
