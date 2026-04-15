import type { CreditAnalysisLog, CreditAnalysisResult, CreditFormData } from "@/types/credit";

const STORAGE_KEY = "credit-analysis-logs";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAnalysisLogs(): CreditAnalysisLog[] {
  if (!isBrowser()) {
    return [];
  }

  const rawLogs = window.localStorage.getItem(STORAGE_KEY);

  if (!rawLogs) {
    return [];
  }

  try {
    return JSON.parse(rawLogs) as CreditAnalysisLog[];
  } catch {
    return [];
  }
}

export function saveAnalysisLog(
  cliente: CreditFormData,
  detalhes: CreditAnalysisResult
): CreditAnalysisLog {
  const newLog: CreditAnalysisLog = {
    id: crypto.randomUUID(),
    dataHora: new Date().toISOString(),
    cliente,
    resultado: detalhes.aprovado ? "Aprovado" : "Reprovado",
    detalhes
  };

  const logs = getAnalysisLogs();
  const updatedLogs = [newLog, ...logs];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));

  return newLog;
}
