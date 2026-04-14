export type DebtHistory = "limpo" | "negativado";
export type CreditDecision = "Aprovado" | "Reprovado";

export type CreditAnalysisInput = {
  age: number;
  monthlyIncome: number;
  debtHistory: DebtHistory;
  loanAmount: number;
};

export type AnalysisLogEntry = {
  id: string;
  timestamp: string;
  customer: CreditAnalysisInput;
  result: CreditDecision;
  reasons: string[];
  monthlyInstallment: number;
  incomeCommitmentPercentage: number;
  installments: number;
};

export type CreditAnalysisResponse = {
  result: CreditDecision;
  summary: string;
  reasons: string[];
  monthlyInstallment: number;
  incomeCommitmentPercentage: number;
  installments: number;
  logEntry: AnalysisLogEntry;
};

const INSTALLMENTS = 12;
const MAX_INCOME_COMMITMENT = 30;

export function validateCreditAnalysisInput(input: CreditAnalysisInput) {
  const isValidDebtHistory = input.debtHistory === "limpo" || input.debtHistory === "negativado";

  if (!Number.isFinite(input.age) || input.age < 0) {
    throw new Error("A idade informada precisa ser um numero valido maior ou igual a zero.");
  }

  if (!Number.isFinite(input.monthlyIncome) || input.monthlyIncome <= 0) {
    throw new Error("A renda mensal precisa ser maior que zero.");
  }

  if (!Number.isFinite(input.loanAmount) || input.loanAmount <= 0) {
    throw new Error("O valor do emprestimo precisa ser maior que zero.");
  }

  if (!isValidDebtHistory) {
    throw new Error("O historico de dividas deve ser 'limpo' ou 'negativado'.");
  }
}

export function analyzeCredit(input: CreditAnalysisInput): CreditAnalysisResponse {
  validateCreditAnalysisInput(input);

  // Regra simplificada: distribuicao do emprestimo em 12 parcelas fixas sem juros.
  const monthlyInstallment = input.loanAmount / INSTALLMENTS;
  const incomeCommitmentPercentage = (monthlyInstallment / input.monthlyIncome) * 100;

  const reasons = [
    input.age >= 18
      ? "Cliente atende ao criterio de maioridade."
      : "Cliente reprovado por ser menor de idade.",
    incomeCommitmentPercentage <= MAX_INCOME_COMMITMENT
      ? "Comprometimento da renda dentro do limite de 30%."
      : "Parcela compromete mais de 30% da renda mensal.",
    input.debtHistory === "limpo"
      ? "Historico de dividas sem restricoes."
      : "Cliente possui restricao no historico de dividas.",
  ];

  const approved =
    input.age >= 18 &&
    incomeCommitmentPercentage <= MAX_INCOME_COMMITMENT &&
    input.debtHistory === "limpo";

  const result: CreditDecision = approved ? "Aprovado" : "Reprovado";

  const logEntry: AnalysisLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    customer: input,
    result,
    reasons,
    monthlyInstallment,
    incomeCommitmentPercentage,
    installments: INSTALLMENTS,
  };

  return {
    result,
    summary: approved
      ? "O credito foi aprovado porque o cliente atende a todos os criterios definidos."
      : "O credito foi reprovado porque pelo menos um dos criterios obrigatorios nao foi atendido.",
    reasons,
    monthlyInstallment,
    incomeCommitmentPercentage,
    installments: INSTALLMENTS,
    logEntry,
  };
}
