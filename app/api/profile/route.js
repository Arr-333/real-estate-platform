import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma"; // adjust path
import { getServerSession } from "next-auth"; // if using auth
import { authOptions } from "../../../src/lib/auth"; // adjust
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

const getAll = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const profile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        broker: true,
        owner: true,
        customer: true,
      },
    });
    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.profile.getAll);
