import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), "data");

export async function ensureDataDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(filePath: string, content: T) {
  await ensureDataDirectory();
  await writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");
}
