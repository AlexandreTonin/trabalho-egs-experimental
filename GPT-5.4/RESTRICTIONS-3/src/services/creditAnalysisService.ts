import {
  CreditAnalysisResult,
  CreditFormData,
  CreditLogEntry,
} from "@/types/credit";
import { saveCreditAnalysisLog } from "@/repositories/creditLogRepository";

const INSTALLMENT_COUNT = 12;
const INCOME_LIMIT = 0.3;

// Service layer: aplica as regras de negocio e orquestra o registro do resultado.
export async function analyzeCreditRequest(data: CreditFormData) {
  const installmentValue = calculateInstallmentValue(data.valorEmprestimo);
  const reasons = collectRejectionReasons(data, installmentValue);
  const result = buildAnalysisResult(installmentValue, reasons);
  await saveCreditAnalysisLog(createLogEntry(data, result));
  return result;
}

function calculateInstallmentValue(loanAmount: number) {
  return Number((loanAmount / INSTALLMENT_COUNT).toFixed(2));
}

function collectRejectionReasons(data: CreditFormData, installmentValue: number) {
  return [
    getAgeRestriction(data.idade),
    getIncomeRestriction(installmentValue, data.rendaMensal),
    getDebtRestriction(data.historicoDividas),
  ].filter((reason): reason is string => Boolean(reason));
}

function getAgeRestriction(age: number) {
  return age >= 18 ? null : "Cliente precisa ter 18 anos ou mais.";
}

function getIncomeRestriction(installmentValue: number, income: number) {
  return installmentValue <= income * INCOME_LIMIT
    ? null
    : "Parcela compromete mais de 30% da renda mensal.";
}

function getDebtRestriction(history: CreditFormData["historicoDividas"]) {
  return history === "limpo" ? null : "Cliente possui restricao no historico de dividas.";
}

function buildAnalysisResult(
  installmentValue: number,
  reasons: string[],
): CreditAnalysisResult {
  return { status: reasons.length === 0 ? "Aprovado" : "Reprovado", installmentValue, reasons };
}

function createLogEntry(
  clientData: CreditFormData,
  result: CreditAnalysisResult,
): CreditLogEntry {
  return { timestamp: new Date().toISOString(), clientData, result };
}
