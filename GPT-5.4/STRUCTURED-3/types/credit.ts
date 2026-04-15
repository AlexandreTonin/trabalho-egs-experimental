export type DebtHistoryOption = "clean" | "negative";

export type AnalysisRequest = {
  age: number;
  monthlyIncome: number;
  debtHistory: DebtHistoryOption;
  requestedLoanAmount: number;
};

export type AnalysisResponse = {
  approved: boolean;
  monthlyInstallment: number;
  incomeCommitmentPercentage: number;
  reasons: string[];
};

export type AnalysisLogEntry = {
  timestamp: string;
  customerData: AnalysisRequest;
  analysis: AnalysisResponse;
};
