export type DebtHistory = "limpo" | "negativado";

export type CreditFormValues = {
  age: string;
  monthlyIncome: string;
  debtHistory: DebtHistory;
  loanAmount: string;
};

export type CreditRequest = {
  age: number;
  monthlyIncome: number;
  debtHistory: DebtHistory;
  loanAmount: number;
};

export type CreditAnalysisResult = {
  status: "Aprovado" | "Reprovado";
  approved: boolean;
  installmentAmount: number;
  commitmentRate: number;
  reasons: string[];
  analyzedAt: string;
};

export type CreditLogEntry = {
  timestamp: string;
  customer: CreditRequest;
  result: CreditAnalysisResult;
};
