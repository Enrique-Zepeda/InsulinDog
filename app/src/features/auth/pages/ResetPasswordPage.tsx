import { PATHS } from "@/app/router/paths";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthFooterLink } from "@/features/auth/components/AuthFooterLink";
import { AuthTextField } from "@/features/auth/components/AuthTextField";
import { useResetPasswordForm } from "@/features/auth/hooks/useResetPasswordForm";

export function ResetPassword() {
  const { form, isLoading, error, successMessage, onSubmit } = useResetPasswordForm();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthCard title="Nueva contraseña" description="Escribe una nueva contraseña para tu cuenta.">
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthTextField
          id="password"
          label="Nueva contraseña"
          placeholder="Mínimo 6 caracteres"
          type="password"
          registration={register("password")}
          error={errors.password}
        />

        <AuthTextField
          id="confirmPassword"
          label="Confirmar nueva contraseña"
          placeholder="Repite tu nueva contraseña"
          type="password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword}
        />

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        {successMessage && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</p>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Actualizando..." : "Actualizar contraseña"}
        </Button>
      </form>

      <AuthFooterLink text="¿Ya actualizaste tu contraseña?" linkText="Inicia sesión" to={PATHS.LOGIN} />
    </AuthCard>
  );
}
