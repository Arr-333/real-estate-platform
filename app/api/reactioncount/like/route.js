import { prisma } from "../../../../src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await prisma.property.update({
    where: { propertyListId: Number(params.id) },
    data: {
      propertyLikes: { increment: 1 },
    },
  });

  return NextResponse.json({ message: "Liked" });
}
