import { z } from "zod";

export const analysisRequestSchema = z.object({
  age: z.number().int().min(0, "A idade deve ser maior ou igual a zero."),
  monthlyIncome: z.number().positive("A renda mensal deve ser maior que zero."),
  debtHistory: z.enum(["clean", "negative"]),
  requestedLoanAmount: z
    .number()
    .positive("O valor do emprestimo deve ser maior que zero.")
});

export type AnalysisRequestInput = z.infer<typeof analysisRequestSchema>;
