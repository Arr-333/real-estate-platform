import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Invalid link" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyExp: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Link expired or invalid" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      // isActive: true,
      emailVerifyToken: null,
      emailVerifyExp: null,
    },
  });

  return NextResponse.redirect(`${process.env.APP_URL}/auth/login`);
}
