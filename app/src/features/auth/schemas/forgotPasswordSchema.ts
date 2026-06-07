import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "El correo es obligatorio.").email("Ingresa un correo válido."),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
