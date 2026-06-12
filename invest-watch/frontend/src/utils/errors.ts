export function mapAuthError(errorMsg: string | undefined): string {
  if (!errorMsg) return "Bilinmeyen bir hata oluştu. / An unknown error occurred.";

  const errLower = errorMsg.toLowerCase();
  
  if (errLower.includes("invalid login credentials")) {
    return "E-posta veya şifre hatalı. / Invalid login credentials.";
  }
  if (errLower.includes("user already registered")) {
    return "Bu e-posta adresi zaten kayıtlı. / This email is already registered.";
  }
  if (errLower.includes("password should be at least")) {
    return "Şifre en az 6 karakter olmalıdır. / Password should be at least 6 characters.";
  }
  if (errLower.includes("rate limit exceeded")) {
    return "Çok fazla istek yapıldı, lütfen daha sonra tekrar deneyin. / Rate limit exceeded, please try again later.";
  }
  if (errLower.includes("invalid email")) {
    return "Geçersiz bir e-posta adresi girdiniz. / You entered an invalid email address.";
  }

  // Fallback
  return `${errorMsg} (Bilinmeyen Hata / Unknown Error)`;
}
