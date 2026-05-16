import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../src/lib/auth";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

const getAll = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // get owner
    const owner = await prisma.owner.findFirst({
      where: { userId },
    });

    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    // ===============================
    // 1️⃣ ALL PROPERTIES
    // ===============================
    const properties = await prisma.property.findMany({
      where: { createdBy: userId },
      select: {
        propertyRent: true,
        propertyListStatus: true,
        propertyBrokerId: true,
      },
    });

    // ===============================
    // 2️⃣ CALCULATIONS
    // ===============================
    let totalPortfolio = 0;
    let grossRevenue = 0;
    let soldCount = 0;

    const brokerSet = new Set();

    properties.forEach((p) => {
      const rent = Number(p.propertyRent || 0);

      totalPortfolio += rent;

      if (p.propertyListStatus === "SOLD") {
        grossRevenue += rent;
        soldCount++;
      }

      if (p.propertyBrokerId) {
        brokerSet.add(p.propertyBrokerId);
      }
    });

    const avgCommission = soldCount > 0 ? grossRevenue / soldCount : 0;

    // ===============================
    // 3️⃣ DEALS CLOSED (FROM ACTIVITY)
    // ===============================
    const closedDeals = await prisma.clientActivity.count({
      where: {
        ownerId: owner.id,
        status: {
          in: ["CLOSED", "DOCS_LEGAL_PROCESS"],
        },
      },
    });

    // ===============================
    // RESPONSE
    // ===============================
    return NextResponse.json({
      totalPortfolio,
      grossRevenue,
      closedDeals,
      activeBrokers: brokerSet.size,
      avgCommission,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.banner.getAll);
