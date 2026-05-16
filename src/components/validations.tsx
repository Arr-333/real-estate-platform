export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(email: string): string {
  if (!email.trim()) return "Email is required";

  if (!emailRegex.test(email)) return "Please enter a valid email address";

  const domain = email.split("@")[1];
  const domainName = domain.split(".")[0];

  if (/^\d+$/.test(domainName))
    return "Domain cannot contain only numbers (e.g. 1@1.com not allowed)";

  return "";
}
