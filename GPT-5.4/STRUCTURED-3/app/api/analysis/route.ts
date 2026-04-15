import { NextRequest, NextResponse } from "next/server";
import { analyzeCredit } from "@/lib/credit-analysis";
import { saveAnalysisLog } from "@/lib/log-storage";
import { analysisRequestSchema } from "@/lib/validation";
import { AnalysisRequest } from "@/types/credit";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as AnalysisRequest;
    const parsedPayload = analysisRequestSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          message: parsedPayload.error.issues[0]?.message ?? "Dados invalidos."
        },
        { status: 400 }
      );
    }

    const analysis = analyzeCredit(parsedPayload.data);

    await saveAnalysisLog({
      timestamp: new Date().toISOString(),
      customerData: parsedPayload.data,
      analysis
    });

    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar analise:", error);

    return NextResponse.json(
      { message: "Nao foi possivel concluir a analise." },
      { status: 500 }
    );
  }
}
