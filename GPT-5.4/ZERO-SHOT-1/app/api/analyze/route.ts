import { NextRequest, NextResponse } from "next/server";

import { analyzeCredit, validateCreditAnalysisInput } from "@/lib/credit-analysis";
import { appendLog, readLogs } from "@/lib/log-storage";
import { CreditAnalysisLogEntry } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const input = validateCreditAnalysisInput(body);
    const result = analyzeCredit(input);

    // Cada avaliacao e persistida para auditoria e exibicao no historico.
    const logEntry: CreditAnalysisLogEntry = {
      createdAt: new Date().toISOString(),
      input,
      result,
    };

    await appendLog(logEntry);

    return NextResponse.json({
      input,
      result,
      logEntry,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel concluir a analise.",
      },
      { status: 400 },
    );
  }
}

export async function GET() {
  const logs = await readLogs();
  return NextResponse.json({ logs });
}
