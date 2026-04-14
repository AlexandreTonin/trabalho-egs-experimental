import { NextResponse } from "next/server";
import { analyzeCredit, type CreditAnalysisInput } from "@/lib/credit-analysis";
import { appendLog, readLogs } from "@/lib/log-store";

export const runtime = "nodejs";

export async function GET() {
  const logs = await readLogs();
  return NextResponse.json({ logs });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreditAnalysisInput;
    const analysis = analyzeCredit(body);

    await appendLog(analysis.logEntry);

    return NextResponse.json(analysis, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Nao foi possivel executar a analise de credito.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
