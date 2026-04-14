import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";

import { analyzeCredit } from "../src/lib/credit-analysis";
import { CreditAnalysisInput, CreditAnalysisLog } from "../src/types/credit";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const DATA_DIR = path.join(process.cwd(), "server", "data");
const LOG_FILE = path.join(DATA_DIR, "analysis-logs.json");

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000",
  }),
);
app.use(express.json());

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, "[]", "utf-8");
  }
}

function readLogs(): CreditAnalysisLog[] {
  ensureStorage();
  return JSON.parse(fs.readFileSync(LOG_FILE, "utf-8")) as CreditAnalysisLog[];
}

function saveLogs(logs: CreditAnalysisLog[]) {
  ensureStorage();
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");
}

function isValidInput(input: Partial<CreditAnalysisInput>): input is CreditAnalysisInput {
  return (
    typeof input.age === "number" &&
    input.age >= 0 &&
    typeof input.monthlyIncome === "number" &&
    input.monthlyIncome >= 0 &&
    (input.debtHistory === "limpo" || input.debtHistory === "negativado") &&
    typeof input.loanAmount === "number" &&
    input.loanAmount >= 0
  );
}

app.get("/api/credit-analysis/logs", (_request, response) => {
  const logs = readLogs().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  response.json({ logs });
});

app.post("/api/credit-analysis", (request, response) => {
  const input = request.body as Partial<CreditAnalysisInput>;

  if (!isValidInput(input)) {
    response.status(400).json({
      message: "Os dados enviados sao invalidos. Revise o formulario e tente novamente.",
    });
    return;
  }

  const result = analyzeCredit(input);
  const log: CreditAnalysisLog = {
    id: crypto.randomUUID(),
    createdAt: result.timestamp,
    customer: input,
    result,
  };

  const currentLogs = readLogs();
  saveLogs([log, ...currentLogs]);

  response.status(201).json({ log });
});

app.listen(PORT, () => {
  ensureStorage();
  console.log(`Credit analysis API listening on http://localhost:${PORT}`);
});
