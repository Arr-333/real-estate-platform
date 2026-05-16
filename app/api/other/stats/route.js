import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../src/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const role = session.user.role;

    let whereCondition = {};

    // 🔑 ROLE MAPPING (IMPORTANT)
    if (role === "BROKER") {
      const broker = await prisma.broker.findFirst({
        where: { userId },
      });

      if (!broker) {
        return NextResponse.json([]);
      }

      whereCondition.brokerId = broker.id;
    } else if (role === "OWNER") {
      const owner = await prisma.owner.findFirst({
        where: { userId },
      });

      if (!owner) {
        return NextResponse.json([]);
      }

      whereCondition.ownerId = owner.id;
    } else if (role === "CUSTOMER") {
      const customer = await prisma.customer.findFirst({
        where: { userId },
      });

      if (!customer) {
        return NextResponse.json([]);
      }

      whereCondition.customerId = customer.id;
    }

    // 🔥 MAIN FIX: GROUP BY STATUS
    const stats = await prisma.clientActivity.groupBy({
      by: ["status"],
      where: whereCondition,
      _count: {
        status: true,
      },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
