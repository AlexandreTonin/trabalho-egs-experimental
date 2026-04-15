import { NextRequest, NextResponse } from "next/server";
import { analyzeCredit } from "@/lib/credit-analysis";
import { saveAnalysisLog } from "@/lib/log-storage";
import { analysisRequestSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedBody = analysisRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Dados inválidos. Revise os campos informados.",
          errors: parsedBody.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const analysis = analyzeCredit(parsedBody.data);

    await saveAnalysisLog({
      timestamp: new Date().toISOString(),
      customerData: parsedBody.data,
      analysis
    });

    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar análise de crédito:", error);

    return NextResponse.json(
      {
        message: "Não foi possível concluir a análise neste momento."
      },
      { status: 500 }
    );
  }
}
