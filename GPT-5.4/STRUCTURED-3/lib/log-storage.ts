import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { AnalysisLogEntry } from "@/types/credit";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const LOG_FILE_PATH = path.join(DATA_DIRECTORY, "analysis-logs.json");

async function ensureStorageReady() {
  await mkdir(DATA_DIRECTORY, { recursive: true });

  try {
    await readFile(LOG_FILE_PATH, "utf-8");
  } catch {
    await writeFile(LOG_FILE_PATH, "[]", "utf-8");
  }
}

export async function readAnalysisLogs(): Promise<AnalysisLogEntry[]> {
  await ensureStorageReady();
  const fileContent = await readFile(LOG_FILE_PATH, "utf-8");

  return JSON.parse(fileContent) as AnalysisLogEntry[];
}

export async function saveAnalysisLog(entry: AnalysisLogEntry) {
  const logs = await readAnalysisLogs();
  logs.unshift(entry);

  // Mantemos o historico em JSON para auditoria simples e leitura humana.
  await writeFile(LOG_FILE_PATH, JSON.stringify(logs, null, 2), "utf-8");
}
