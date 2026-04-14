import { promises as fs } from "fs";
import path from "path";
import { AnalysisLogEntry } from "@/types/credit";

const dataDirectory = path.join(process.cwd(), "data");
const dataFilePath = path.join(dataDirectory, "analysis-log.json");

async function ensureDataFile() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, "[]", "utf-8");
  }
}

export async function getAnalysisLogs(): Promise<AnalysisLogEntry[]> {
  await ensureDataFile();
  const fileContent = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(fileContent) as AnalysisLogEntry[];
}

export async function saveAnalysisLog(entry: AnalysisLogEntry): Promise<void> {
  const existing = await getAnalysisLogs();
  existing.unshift(entry);

  // Mantém apenas os 20 registros mais recentes para o exemplo ficar enxuto.
  await fs.writeFile(
    dataFilePath,
    JSON.stringify(existing.slice(0, 20), null, 2),
    "utf-8"
  );
}
