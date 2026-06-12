import { PATHS } from "@/app/router/paths";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthFooterLink } from "@/features/auth/components/AuthFooterLink";
import { AuthTextField } from "@/features/auth/components/AuthTextField";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";

export function Register() {
  const { form, isLoading, error, successMessage, onSubmit } = useRegisterForm();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthCard title="Crear cuenta" description="Registra tu cuenta para empezar a usar InsulinDog.">
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthTextField
          id="name"
          label="Nombre"
          placeholder="Ej. Tonita"
          registration={register("name")}
          error={errors.name}
        />

        <AuthTextField
          id="email"
          label="Correo electrónico"
          placeholder="tu@email.com"
          type="email"
          registration={register("email")}
          error={errors.email}
        />

        <AuthTextField
          id="password"
          label="Contraseña"
          placeholder="Mínimo 6 caracteres"
          type="password"
          registration={register("password")}
          error={errors.password}
        />

        <AuthTextField
          id="confirmPassword"
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          type="password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword}
        />

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        {successMessage && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</p>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <AuthFooterLink text="¿Ya tienes cuenta?" linkText="Inicia sesión" to={PATHS.LOGIN} />
    </AuthCard>
  );
}
