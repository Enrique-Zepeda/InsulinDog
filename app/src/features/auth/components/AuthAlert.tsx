type AuthAlertProps = {
  message?: string | null;
  variant: "error" | "success";
};

export function AuthAlert({ message, variant }: AuthAlertProps) {
  if (!message) return null;

  const variantClassName =
    variant === "error"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";

  return (
    <p role="alert" className={`rounded-lg border px-3 py-2 text-sm ${variantClassName}`}>
      {message}
    </p>
  );
}
