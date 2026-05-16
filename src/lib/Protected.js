"use client";

import { canAccess } from "@/lib/canAccess";
import { useRole } from "@/hooks/useRole";

export default function Protected({ resource, action, children }) {
  const { role } = useRole();

  if (!canAccess(resource, action, role)) return null;

  return children;
}

// import Protected from "@/components/Protected";

// <Protected resource="propertyType" action="create">
//     <button>Create Property Type</button>
// </Protected>
