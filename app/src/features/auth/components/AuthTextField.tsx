import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import type { HTMLInputTypeAttribute } from "react";

type AuthTextFieldProps = {
  id: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
};

export function AuthTextField({ id, label, type = "text", placeholder, error, registration }: AuthTextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-zinc-700">
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-900"
        {...registration}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
