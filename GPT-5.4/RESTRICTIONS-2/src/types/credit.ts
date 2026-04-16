export type DebtHistory = "limpo" | "negativado";

export type CustomerData = {
  age: number;
  monthlyIncome: number;
  debtHistory: DebtHistory;
  requestedLoan: number;
};

export type AnalysisStatus = "Aprovado" | "Reprovado";

export type AnalysisResult = {
  status: AnalysisStatus;
  installment: number;
  compromisedIncome: number;
  reasons: string[];
};

export type CreditLogEntry = {
  timestamp: string;
  customerData: CustomerData;
  result: AnalysisStatus;
};
