import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AnalysisLogEntry } from "@/lib/credit-analysis";

const dataDirectory = path.join(process.cwd(), "data");
const logFilePath = path.join(dataDirectory, "credit-analysis-logs.json");

async function ensureLogFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(logFilePath, "utf-8");
  } catch {
    await writeFile(logFilePath, "[]", "utf-8");
  }
}

export async function readLogs(): Promise<AnalysisLogEntry[]> {
  await ensureLogFile();
  const rawContent = await readFile(logFilePath, "utf-8");

  try {
    return JSON.parse(rawContent) as AnalysisLogEntry[];
  } catch {
    return [];
  }
}

export async function appendLog(entry: AnalysisLogEntry): Promise<void> {
  const existingLogs = await readLogs();
  const nextLogs = [entry, ...existingLogs].slice(0, 100);

  await writeFile(logFilePath, JSON.stringify(nextLogs, null, 2), "utf-8");
}
