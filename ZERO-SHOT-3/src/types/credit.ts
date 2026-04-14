export type DebtHistory = "limpo" | "negativado";

export interface CreditAnalysisInput {
  age: number;
  monthlyIncome: number;
  debtHistory: DebtHistory;
  loanAmount: number;
}

export interface CreditAnalysisResult {
  approved: boolean;
  status: "Aprovado" | "Reprovado";
  timestamp: string;
  fixedInstallments: number;
  monthlyInstallment: number;
  commitmentRate: number;
  reasons: string[];
}

export interface CreditAnalysisLog {
  id: string;
  createdAt: string;
  customer: CreditAnalysisInput;
  result: CreditAnalysisResult;
}
