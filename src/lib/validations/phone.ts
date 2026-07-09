import { z } from "zod";
import { isValidBrazilianPhone } from "@/lib/utils/phone";

export const brazilianPhoneSchema = z
  .string()
  .min(1, "Informe um telefone válido")
  .refine(
    isValidBrazilianPhone,
    "Informe um telefone brasileiro válido (+55 DDD número)"
  );
