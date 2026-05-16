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

    // ===============================
    // DATE RANGES
    // ===============================
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // ===============================
    // FETCH PROPERTIES
    // ===============================
    const properties = await prisma.property.findMany({
      where: { createdBy: userId },
      select: {
        propertyRent: true,
        propertyListStatus: true,
        propertyCreatedOn: true,
      },
    });

    // ===============================
    // FETCH ACTIVITIES
    // ===============================
    const activities = await prisma.clientActivity.findMany({
      where: { ownerId: userId },
      select: {
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    });

    // ===============================
    // CALCULATIONS
    // ===============================
    let monthlyRevenue = 0;
    let totalCommission = 0;
    let activeListings = 0;
    let totalDealValue = 0;
    let soldCount = 0;

    properties.forEach((p) => {
      const rent = Number(p.propertyRent || 0);

      // Monthly revenue
      if (
        p.propertyListStatus === "SOLD" &&
        p.propertyCreatedOn >= startOfMonth
      ) {
        monthlyRevenue += rent;
      }

      // Commission (assume 18%)
      if (p.propertyListStatus === "SOLD") {
        totalCommission += rent * 0.18;
        totalDealValue += rent;
        soldCount++;
      }

      // Active listings
      if (p.propertyListStatus === "ACTIVE") {
        activeListings++;
      }
    });

    // Avg deal value
    const avgDealValue = soldCount > 0 ? totalDealValue / soldCount : 0;

    // Avg days to close
    let totalDays = 0;
    let closedCount = 0;

    activities.forEach((a) => {
      if (["CLOSED", "DOCS_LEGAL_PROCESS"].includes(a.status)) {
        const days =
          (new Date(a.updatedAt) - new Date(a.createdAt)) /
          (1000 * 60 * 60 * 24);

        totalDays += days;
        closedCount++;
      }
    });

    const avgDaysToClose =
      closedCount > 0 ? Math.round(totalDays / closedCount) : 0;

    return NextResponse.json({
      monthlyRevenue,
      commissionsPaid: totalCommission,
      activeListings,
      avgDealValue,
      avgDaysToClose,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.kpi.getAll);
