import { CreditLog } from '@/types/credit';

const STORAGE_KEY = 'credit-analysis-logs';

// Camada Repository: isola toda leitura e escrita no LocalStorage.
export function saveCreditLog(log: CreditLog) {
  const logs = getCreditLogs();
  const nextLogs = [log, ...logs];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLogs));
}

export function getCreditLogs() {
  const rawLogs = localStorage.getItem(STORAGE_KEY);
  return rawLogs ? (JSON.parse(rawLogs) as CreditLog[]) : [];
}
