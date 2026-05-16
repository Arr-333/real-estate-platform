import { NextResponse } from "next/server";
import { authorize } from "./authorize";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export const withAuth = (handler, allowedRoles) => {
  return async (req, context) => {
    // ✅ get session properly
    const session = await getServerSession(authOptions);

    const user = session?.user || null;

    const isAllowed = authorize(allowedRoles, user);

    if (!isAllowed) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return handler(req, context, user);
  };
};
