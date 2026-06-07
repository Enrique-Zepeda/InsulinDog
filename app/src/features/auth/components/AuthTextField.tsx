import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

type AuthTextFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function AuthTextField({ id, name, label, value, type = "text", placeholder, onChange }: AuthTextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-zinc-700">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-900"
      />
    </div>
  );
}
