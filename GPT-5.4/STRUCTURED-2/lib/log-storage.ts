import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { AnalysisLogEntry } from "@/types/credit";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const LOG_FILE_PATH = path.join(DATA_DIRECTORY, "analysis-logs.json");

async function ensureLogFileExists() {
  await mkdir(DATA_DIRECTORY, { recursive: true });

  try {
    await readFile(LOG_FILE_PATH, "utf-8");
  } catch {
    await writeFile(LOG_FILE_PATH, "[]", "utf-8");
  }
}

async function readLogs(): Promise<AnalysisLogEntry[]> {
  await ensureLogFileExists();
  const fileContent = await readFile(LOG_FILE_PATH, "utf-8");

  return JSON.parse(fileContent) as AnalysisLogEntry[];
}

export async function saveAnalysisLog(entry: AnalysisLogEntry) {
  const logs = await readLogs();
  logs.push(entry);

  // Persistimos em arquivo JSON para manter histórico simples e auditável.
  await writeFile(LOG_FILE_PATH, JSON.stringify(logs, null, 2), "utf-8");
}
