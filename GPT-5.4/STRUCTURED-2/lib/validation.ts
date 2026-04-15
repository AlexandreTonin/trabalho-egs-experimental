import { z } from "zod";

export const analysisRequestSchema = z.object({
  age: z.number().min(0, "A idade não pode ser negativa."),
  monthlyIncome: z.number().positive("A renda mensal deve ser maior que zero."),
  debtHistory: z.enum(["clean", "negative"]),
  requestedLoanAmount: z
    .number()
    .positive("O valor do empréstimo deve ser maior que zero.")
});
