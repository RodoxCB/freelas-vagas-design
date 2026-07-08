import { z } from "zod";

/** Alinhado com Supabase `password_requirements = lower_upper_letters_digits` */
export const passwordSchema = z
  .string()
  .min(8, "Senha deve ter pelo menos 8 caracteres")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    "Senha deve conter letra maiúscula, minúscula e número"
  );

export const PASSWORD_HINT =
  "Mínimo 8 caracteres, com maiúscula, minúscula e número";
