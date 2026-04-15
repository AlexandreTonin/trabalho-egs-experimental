export type DebtHistory = 'limpo' | 'negativado';

export type CreditFormData = {
  age: number;
  monthlyIncome: number;
  debtHistory: DebtHistory;
  loanAmount: number;
};

export type CreditAnalysisResult = {
  status: 'Aprovado' | 'Reprovado';
  installmentAmount: number;
  reasons: string[];
};

export type CreditLog = {
  createdAt: string;
  customerData: CreditFormData;
  analysisResult: CreditAnalysisResult;
};
