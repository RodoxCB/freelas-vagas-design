import { z } from "zod";
import { isValidPhone } from "@/lib/utils/phone";

export const phoneSchema = z
  .string()
  .min(1, "Informe um telefone válido")
  .refine(
    isValidPhone,
    "Informe um telefone válido com DDI e número"
  );

/** @deprecated Use phoneSchema */
export const brazilianPhoneSchema = phoneSchema;
