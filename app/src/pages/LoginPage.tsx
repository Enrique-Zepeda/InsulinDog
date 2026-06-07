import { useState, type ChangeEvent, type FormEvent } from "react";

import { PATHS } from "@/app/router/paths";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { AuthFooterLink } from "@/features/auth/components/AuthFooterLink";
import { AuthTextField } from "@/features/auth/components/AuthTextField";

type LoginForm = {
  email: string;
  password: string;
};

const initialForm: LoginForm = {
  email: "",
  password: "",
};

export function Login() {
  const [form, setForm] = useState<LoginForm>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Login form:", form);

    // Aquí luego conectamos loginUser con Redux + Supabase.
  };

  return (
    <AuthCard title="Iniciar sesión" description="Accede a tu cuenta de InsulinDog.">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Tu contraseña"
          type="password"
        />

        <Button type="submit" className="w-full">
          Iniciar sesión
        </Button>
      </form>

      <AuthFooterLink text="¿No tienes cuenta?" linkText="Regístrate" to={PATHS.REGISTER} />
    </AuthCard>
  );
}
