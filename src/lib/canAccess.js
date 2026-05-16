import { ACCESS_CONTROL } from "@/lib/accessControl";

export const canAccess = (resource, action, role) => {
  const allowedRoles = ACCESS_CONTROL[resource]?.[action] || [];

  if (allowedRoles.includes("PUBLIC")) return true;

  if (!role) return false;

  return allowedRoles.includes(role);
};
