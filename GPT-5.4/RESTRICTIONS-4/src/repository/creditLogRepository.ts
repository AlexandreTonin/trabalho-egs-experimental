import { CreditLogEntry } from "@/types/credit";

const STORAGE_KEY = "credit-analysis-logs";
const STORAGE_EVENT = "credit-analysis-logs-changed";

// Camada Repository: concentra toda leitura e escrita no LocalStorage.
function isBrowserEnvironment() {
  return typeof window !== "undefined";
}

function readStorageValue() {
  return isBrowserEnvironment() ? localStorage.getItem(STORAGE_KEY) : null;
}

function parseLogs(storageValue: string | null) {
  return storageValue ? (JSON.parse(storageValue) as CreditLogEntry[]) : [];
}

function serializeLogs(entries: CreditLogEntry[]) {
  return JSON.stringify(entries);
}

function persistLogs(entries: CreditLogEntry[]) {
  if (!isBrowserEnvironment()) return;
  localStorage.setItem(STORAGE_KEY, serializeLogs(entries));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function listCreditLogs() {
  return parseLogs(readStorageValue());
}

export function subscribeCreditLogs(listener: () => void) {
  if (!isBrowserEnvironment()) return () => undefined;
  window.addEventListener(STORAGE_EVENT, listener);
  return () => window.removeEventListener(STORAGE_EVENT, listener);
}

export function saveCreditLog(entry: CreditLogEntry) {
  const entries = [entry, ...listCreditLogs()];
  persistLogs(entries);
}
