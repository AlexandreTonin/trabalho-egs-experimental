import path from "node:path";
import { CreditLogEntry } from "@/types/credit";
import { readJsonFile, writeJsonFile } from "@/lib/fileStorage";

const logFilePath = path.join(process.cwd(), "data", "credit-logs.json");

// Repository layer: unico ponto que conhece a persistencia em JSON.
export async function saveCreditAnalysisLog(entry: CreditLogEntry) {
  const entries = await readCreditAnalysisLogs();
  entries.push(entry);
  await writeJsonFile(logFilePath, entries);
}

export function readCreditAnalysisLogs() {
  return readJsonFile<CreditLogEntry[]>(logFilePath, []);
}
