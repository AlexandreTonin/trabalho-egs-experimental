import { promises as fs } from "node:fs";
import path from "node:path";

import { CreditAnalysisLogEntry } from "@/lib/types";

const LOG_FILE_PATH = path.join(process.cwd(), "data", "analysis-log.json");

async function ensureLogFile() {
  await fs.mkdir(path.dirname(LOG_FILE_PATH), { recursive: true });

  try {
    await fs.access(LOG_FILE_PATH);
  } catch {
    // O arquivo e criado sob demanda para simplificar a execucao local.
    await fs.writeFile(LOG_FILE_PATH, "[]", "utf-8");
  }
}

export async function readLogs(): Promise<CreditAnalysisLogEntry[]> {
  await ensureLogFile();

  const fileContent = await fs.readFile(LOG_FILE_PATH, "utf-8");

  try {
    const parsed = JSON.parse(fileContent) as CreditAnalysisLogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function appendLog(entry: CreditAnalysisLogEntry): Promise<void> {
  const logs = await readLogs();
  logs.unshift(entry);
  await fs.writeFile(LOG_FILE_PATH, JSON.stringify(logs, null, 2), "utf-8");
}
