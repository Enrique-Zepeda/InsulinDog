import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "El nombre es obligatorio."),

    email: z.string().trim().toLowerCase().min(1, "El correo es obligatorio.").email("Ingresa un correo válido."),

    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),

    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
