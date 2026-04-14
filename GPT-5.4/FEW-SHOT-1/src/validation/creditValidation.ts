import { DebtHistoryStatus } from "@/types/credit";

export function validatePositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function validateDebtHistoryStatus(value: string): value is DebtHistoryStatus {
  return value === "limpo" || value === "negativado";
}
