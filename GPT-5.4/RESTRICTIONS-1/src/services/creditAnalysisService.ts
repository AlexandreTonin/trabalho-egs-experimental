import { getCreditLogs, saveCreditLog } from '@/repositories/creditLogRepository';
import {
  CreditAnalysisResult,
  CreditFormData,
  CreditLog,
} from '@/types/credit';
import { validateCreditData } from '@/validations/creditValidation';

// Camada Service: aplica as regras de negocio sem conhecer detalhes da UI.
export function analyzeCredit(data: CreditFormData): CreditAnalysisResult {
  const reasons = buildRejectionReasons(data);
  const installmentAmount = calculateInstallmentAmount(data.loanAmount);
  return createAnalysisResult(reasons, installmentAmount);
}

export function registerCreditAnalysis(data: CreditFormData) {
  const analysisResult = analyzeCredit(data);
  const log = buildCreditLog(data, analysisResult);
  saveCreditLog(log);
  return analysisResult;
}

export function listCreditLogs() {
  return getCreditLogs();
}

export function calculateInstallmentAmount(loanAmount: number) {
  return Number((loanAmount / 12).toFixed(2));
}

function buildRejectionReasons(data: CreditFormData) {
  const installmentAmount = calculateInstallmentAmount(data.loanAmount);
  const rules = getBusinessRuleResults(data, installmentAmount);
  return [...validateCreditData(data), ...rules].filter(Boolean);
}

function validateIncomeCommitment(income: number, installmentAmount: number) {
  const limit = Number((income * 0.3).toFixed(2));
  return installmentAmount <= limit ? '' : 'A parcela compromete mais de 30% da renda.';
}

function validateDebtHistory(debtHistory: CreditFormData['debtHistory']) {
  return debtHistory === 'limpo' ? '' : 'O cliente possui restricao no historico de dividas.';
}

function getBusinessRuleResults(data: CreditFormData, installmentAmount: number) {
  return [validateIncomeCommitment(data.monthlyIncome, installmentAmount), validateDebtHistory(data.debtHistory)];
}

function createAnalysisResult(reasons: string[], installmentAmount: number) {
  const status: CreditAnalysisResult['status'] = reasons.length === 0 ? 'Aprovado' : 'Reprovado';
  return {
    status,
    installmentAmount,
    reasons,
  };
}

function buildCreditLog(customerData: CreditFormData, analysisResult: CreditAnalysisResult): CreditLog {
  return { createdAt: new Date().toISOString(), customerData, analysisResult };
}
