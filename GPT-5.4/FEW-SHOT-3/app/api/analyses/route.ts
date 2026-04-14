import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { saveAnalysisLog, getAnalysisLogs } from "@/repository/analysisLogRepository";
import { processCreditAnalysis } from "@/service/creditAnalysisService";
import { CreditAnalysisInput } from "@/types/credit";
import { validateCreditAnalysisInput } from "@/validation/creditValidation";

export const runtime = "nodejs";

export async function GET() {
  const logs = await getAnalysisLogs();
  return NextResponse.json({ logs });
}

export async function POST(request: NextRequest) {
  let payload: CreditAnalysisInput;

  try {
    payload = (await request.json()) as CreditAnalysisInput;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "O corpo da requisição não está em JSON válido.",
        errors: ["Envie os dados do cliente em formato JSON válido."]
      },
      { status: 400 }
    );
  }

  const validation = validateCreditAnalysisInput(payload);

  if (!validation.valid) {
    return NextResponse.json(
      {
        success: false,
        message: "Dados inválidos para análise.",
        errors: validation.errors
      },
      { status: 400 }
    );
  }

  const result = processCreditAnalysis(payload);
  const entry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    customer: payload,
    result
  };

  await saveAnalysisLog(entry);

  return NextResponse.json({
    success: true,
    result,
    log: entry
  });
}
