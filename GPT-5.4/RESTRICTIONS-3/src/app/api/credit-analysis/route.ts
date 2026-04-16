import { NextResponse } from "next/server";
import { analyzeCreditRequest } from "@/services/creditAnalysisService";
import { validateCreditInput } from "@/validation/creditValidation";
import { CreditFormData } from "@/types/credit";

// API route: conecta UI, validacao, service e repository sem misturar responsabilidades.
export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CreditFormData;
    return handleAnalysisRequest(data);
  } catch {
    return NextResponse.json({ message: "Nao foi possivel processar a solicitacao." }, { status: 400 });
  }
}

async function handleAnalysisRequest(data: CreditFormData) {
  const validation = validateCreditInput(data);
  if (!validation.isValid) {
    return NextResponse.json({ message: validation.errors.join(" ") }, { status: 400 });
  }
  return NextResponse.json(await analyzeCreditRequest(data));
}
