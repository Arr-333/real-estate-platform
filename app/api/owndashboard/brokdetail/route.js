import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../src/lib/auth";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

const getAll = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // 🔥 Get owner
    const owner = await prisma.owner.findFirst({
      where: { userId },
    });

    if (!owner) {
      return NextResponse.json({ data: [] });
    }

    // 🔥 Fetch properties grouped by broker
    const properties = await prisma.property.findMany({
      where: {
        ownerId: owner.id,
        propertyBrokerId: { not: null },
      },
      include: {
        broker: {
          include: {
            user: true,
          },
        },
      },
    });

    // 🔥 Group by broker
    const brokerMap = {};

    properties.forEach((prop) => {
      const broker = prop.broker;
      if (!broker) return;

      if (!brokerMap[broker.id]) {
        brokerMap[broker.id] = {
          brokerId: broker.id,
          name: broker.user?.name || "N/A",
          totalProperties: 0,
          properties: [],
        };
      }

      brokerMap[broker.id].totalProperties += 1;

      brokerMap[broker.id].properties.push({
        id: prop.propertyListId,
        title: prop.propertyTitle,
        rent: prop.propertyRent,
        location: prop.propertyLocal,
      });
    });

    const result = Object.values(brokerMap);

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.brokdetail.getAll);
