import { saveToLocalStorage } from "@/repositories/localStorageRepository";
import { CreditAnalysisInput, CreditAnalysisLog, CreditAnalysisResult } from "@/types/credit";

const CREDIT_ANALYSIS_LOG_KEY = "credit-analysis-logs";

export function createCreditAnalysisLog(
  input: CreditAnalysisInput,
  result: CreditAnalysisResult,
): CreditAnalysisLog {
  return {
    createdAt: new Date().toISOString(),
    input,
    result,
  };
}

export function logCreditAnalysis(input: CreditAnalysisInput, result: CreditAnalysisResult) {
  const logEntry = createCreditAnalysisLog(input, result);

  saveToLocalStorage(CREDIT_ANALYSIS_LOG_KEY, logEntry);

  return logEntry;
}

export function getCreditAnalysisLogKey() {
  return CREDIT_ANALYSIS_LOG_KEY;
}
