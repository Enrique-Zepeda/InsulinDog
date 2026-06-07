import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthFooterLink } from "@/features/auth/components/AuthFooterLink";
import { AuthTextField } from "@/features/auth/components/AuthTextField";
import { clearAuthFeedback, registerUser } from "@/features/auth/slices/authSlice";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: RegisterForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error, successMessage } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(clearAuthFeedback());
    setLocalError(null);

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email || !form.password || !form.confirmPassword) {
      setLocalError("Todos los campos son obligatorios.");
      return;
    }

    if (form.password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setLocalError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          name,
          email,
          password: form.password,
        }),
      ).unwrap();

      setForm(initialForm);

      if (result.hasSession) {
        navigate(PATHS.HOME);
      }
    } catch {
      // El error ya viene desde Redux.
    }
  };

  return (
    <AuthCard title="Crear cuenta" description="Registra tu cuenta para empezar a usar InsulinDog.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthTextField
          id="name"
          name="name"
          label="Nombre"
          value={form.name}
          onChange={handleChange}
          placeholder="Ej. Edgar"
        />

        <AuthTextField
          id="email"
          name="email"
          label="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          type="email"
        />

        <AuthTextField
          id="password"
          name="password"
          label="Contraseña"
          value={form.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          type="password"
        />

        <AuthTextField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
          type="password"
        />

        {(localError || error) && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{localError || error}</p>
        )}

        {successMessage && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</p>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <AuthFooterLink text="¿Ya tienes cuenta?" linkText="Inicia sesión" to={PATHS.LOGIN} />
    </AuthCard>
  );
}
