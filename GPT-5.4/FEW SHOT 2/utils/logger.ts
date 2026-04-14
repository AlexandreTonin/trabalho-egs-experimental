import { getFromLocalStorage, saveToLocalStorage } from "@/repository/localStorageRepository";
import type { CreditAnalysisInput, CreditAnalysisResult, CreditLogEntry } from "@/types/credit";

const CREDIT_LOGS_STORAGE_KEY = "credit-analysis-logs";
const CREDIT_LOGS_UPDATED_EVENT = "credit-analysis-logs-updated";

export function logCreditAnalysis(customer: CreditAnalysisInput, result: CreditAnalysisResult) {
  const payload: CreditLogEntry = {
    createdAt: new Date().toISOString(),
    customer,
    result
  };

  saveToLocalStorage<CreditLogEntry>(CREDIT_LOGS_STORAGE_KEY, payload);
  window.dispatchEvent(new Event(CREDIT_LOGS_UPDATED_EVENT));
}

export function getCreditAnalysisLogs(): CreditLogEntry[] {
  return getFromLocalStorage<CreditLogEntry>(CREDIT_LOGS_STORAGE_KEY);
}

export function subscribeToCreditAnalysisLogs(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleUpdate = () => callback();

  window.addEventListener("storage", handleUpdate);
  window.addEventListener(CREDIT_LOGS_UPDATED_EVENT, handleUpdate);

  return () => {
    window.removeEventListener("storage", handleUpdate);
    window.removeEventListener(CREDIT_LOGS_UPDATED_EVENT, handleUpdate);
  };
}
