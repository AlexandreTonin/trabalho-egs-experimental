export type DebtHistory = "limpo" | "negativado";

export type CreditFormData = {
  idade: number;
  rendaMensal: number;
  historicoDividas: DebtHistory;
  valorEmprestimo: number;
};

export type CreditAnalysisResult = {
  aprovado: boolean;
  parcelaMensal: number;
  percentualComprometido: number;
  motivos: string[];
};

export type CreditAnalysisLog = {
  id: string;
  dataHora: string;
  cliente: CreditFormData;
  resultado: "Aprovado" | "Reprovado";
  detalhes: CreditAnalysisResult;
};
