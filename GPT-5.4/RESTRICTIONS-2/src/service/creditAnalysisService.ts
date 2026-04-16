import { saveLog } from "@/repository/logRepository";
import { AnalysisResult, CustomerData } from "@/types/credit";
import { isAdult, validateCustomerData } from "@/validation/creditValidation";

// Service layer: aplica regras de negocio e usa o repository por abstracao.
export function analyzeCredit(data: CustomerData) {
  const errors = validateCustomerData(data);
  const reasons = [...errors, ...buildBusinessReasons(data)];
  const result = buildResult(data, reasons);
  registerLog(data, result.status);
  return result;
}

export function calculateInstallment(requestedLoan: number) {
  return requestedLoan / 12;
}

export function calculateCompromisedIncome(data: CustomerData) {
  return (calculateInstallment(data.requestedLoan) / data.monthlyIncome) * 100;
}

function buildBusinessReasons(data: CustomerData) {
  return [
    ...getAgeReason(data.age),
    ...getIncomeReason(data),
    ...getDebtReason(data.debtHistory)
  ];
}

function getAgeReason(age: number) {
  return isAdult(age) ? [] : ["Cliente deve ter 18 anos ou mais."];
}

function getIncomeReason(data: CustomerData) {
  const compromisedIncome = calculateCompromisedIncome(data);
  return compromisedIncome <= 30 ? [] : ["Parcela compromete mais de 30% da renda mensal."];
}

function getDebtReason(debtHistory: CustomerData["debtHistory"]) {
  return debtHistory === "limpo" ? [] : ["Cliente possui restricao no historico de dividas."];
}

function buildResult(data: CustomerData, reasons: string[]): AnalysisResult {
  const installment = calculateInstallment(data.requestedLoan);
  const compromisedIncome = calculateCompromisedIncome(data);
  return createResult(reasons, installment, compromisedIncome);
}

function createResult(
  reasons: string[],
  installment: number,
  compromisedIncome: number
): AnalysisResult {
  const status = reasons.length === 0 ? "Aprovado" : "Reprovado";
  return { status, installment, compromisedIncome, reasons };
}

function registerLog(data: CustomerData, result: AnalysisResult["status"]) {
  saveLog({ timestamp: new Date().toISOString(), customerData: data, result });
}
