import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Invalid link" }, { status: 400 });
  }

  await prisma.user.updateMany({
    where: { emailVerifyToken: token },
    data: {
      emailVerifyToken: null,
      emailVerifyExp: null,
      // optional hardening:
      isActive: false,
    },
  });

  return NextResponse.redirect(`${process.env.APP_URL}/`);
}
