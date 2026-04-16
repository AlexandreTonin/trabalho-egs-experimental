import { CreditLogEntry } from "@/types/credit";

const STORAGE_KEY = "credit-analysis-logs";

// Repository layer: concentra toda leitura e escrita de persistencia.
export function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function readLogs(): CreditLogEntry[] {
  if (!canUseStorage()) return [];
  return parseLogs(window.localStorage.getItem(STORAGE_KEY));
}

export function saveLog(entry: CreditLogEntry) {
  if (!canUseStorage()) return;
  const updatedLogs = [...readLogs(), entry];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
}

function parseLogs(rawLogs: string | null) {
  if (!rawLogs) return [];
  return JSON.parse(rawLogs) as CreditLogEntry[];
}
