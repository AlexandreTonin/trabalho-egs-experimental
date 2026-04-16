import { saveCreditLog } from "@/repository/creditLogRepository";
import { CreditAnalysisResult, CreditFormValues, CreditLogEntry, CreditRequest } from "@/types/credit";
import { validateCreditRequest } from "@/validation/creditValidation";

// Camada Service: aplica as regras de negócio e coordena as outras camadas.
function toNumber(value: string) {
  return Number(value.replace(",", "."));
}

function createCreditRequest(values: CreditFormValues): CreditRequest {
  return {
    age: toNumber(values.age),
    monthlyIncome: toNumber(values.monthlyIncome),
    debtHistory: values.debtHistory,
    loanAmount: toNumber(values.loanAmount),
  };
}

export function calculateInstallmentAmount(loanAmount: number) {
  return loanAmount / 12;
}

export function calculateCommitmentRate(installmentAmount: number, monthlyIncome: number) {
  return monthlyIncome > 0 ? installmentAmount / monthlyIncome : Infinity;
}

function isApproved(reasons: string[]) {
  return reasons.length === 0;
}

function createStatus(approved: boolean) {
  return approved ? "Aprovado" : "Reprovado";
}

function createAnalysisResult(reasons: string[], installmentAmount: number): CreditAnalysisResult {
  const approved = isApproved(reasons);
  return { approved, status: createStatus(approved), reasons, installmentAmount, commitmentRate: 0, analyzedAt: new Date().toISOString() };
}

function attachCommitmentRate(result: CreditAnalysisResult, commitmentRate: number) {
  return { ...result, commitmentRate };
}

function createLogEntry(customer: CreditRequest, result: CreditAnalysisResult): CreditLogEntry {
  return { timestamp: result.analyzedAt, customer, result };
}

export function analyzeCredit(values: CreditFormValues) {
  const customer = createCreditRequest(values);
  const installmentAmount = calculateInstallmentAmount(customer.loanAmount);
  const commitmentRate = calculateCommitmentRate(installmentAmount, customer.monthlyIncome);
  const reasons = validateCreditRequest(customer, commitmentRate);
  const result = attachCommitmentRate(createAnalysisResult(reasons, installmentAmount), commitmentRate);
  saveCreditLog(createLogEntry(customer, result));
  return result;
}
