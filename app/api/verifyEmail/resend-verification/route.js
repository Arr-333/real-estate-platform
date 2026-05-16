import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "../../../../src/lib/prisma";
import { sendVerificationEmail } from "../../../../src/lib/mail";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (user.isEmailVerified) {
    return NextResponse.json(
      { message: "Email already verified" },
      { status: 400 }
    );
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifyToken: token,
      emailVerifyExp: expiry,
    },
  });

  await sendVerificationEmail(user.email, token);

  return NextResponse.json({ message: "Verification resent" });
}
