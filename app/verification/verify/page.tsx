import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) redirect("/");

  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyExp: { gt: new Date() },
    },
  });

  // Invalid or expired token

  if (!user) redirect("/verification/email");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null,
      emailVerifyExp: null,
    },
  });

  redirect("/auth/login");
}
