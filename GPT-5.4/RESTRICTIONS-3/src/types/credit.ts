export type DebtHistory = "limpo" | "negativado";
export type AnalysisStatus = "Aprovado" | "Reprovado";

export type CreditFormData = {
  idade: number;
  rendaMensal: number;
  historicoDividas: DebtHistory;
  valorEmprestimo: number;
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type CreditAnalysisResult = {
  status: AnalysisStatus;
  installmentValue: number;
  reasons: string[];
};

export type CreditLogEntry = {
  timestamp: string;
  clientData: CreditFormData;
  result: CreditAnalysisResult;
};
