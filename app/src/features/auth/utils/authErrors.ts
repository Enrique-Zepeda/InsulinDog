export function getRegisterErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("email rate limit") ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("too many requests")
  ) {
    return "Supabase bloqueó temporalmente el envío de correos. Espera una hora o configura SMTP propio para seguir probando.";
  }

  return message;
}

export function getLoginErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("email not confirmed") ||
    normalizedMessage.includes("email not verified") ||
    normalizedMessage.includes("not confirmed")
  ) {
    return "Tu cuenta no está verificada. Revisa tu correo y confirma tu cuenta.";
  }

  if (normalizedMessage.includes("invalid login credentials") || normalizedMessage.includes("invalid credentials")) {
    return "Correo o contraseña incorrectos.";
  }

  return "No se pudo iniciar sesión. Inténtalo de nuevo.";
}
