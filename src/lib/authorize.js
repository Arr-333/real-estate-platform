export const authorize = (allowedRoles, user) => {
  if (allowedRoles.includes("PUBLIC")) return true;

  if (!user || !user.role) return false;

  return allowedRoles.includes(user.role);
};
