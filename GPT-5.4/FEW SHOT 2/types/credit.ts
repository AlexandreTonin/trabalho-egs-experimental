export type DebtHistory = "limpo" | "negativado";

export type CreditAnalysisInput = {
  age: number;
  monthlyIncome: number;
  debtHistory: DebtHistory;
  requestedAmount: number;
};

export type CreditAnalysisResult = {
  approved: boolean;
  message: string;
  monthlyInstallment: number;
  commitmentRate: number;
  reasons: string[];
};

export type CreditLogEntry = {
  createdAt: string;
  customer: CreditAnalysisInput;
  result: CreditAnalysisResult;
};
