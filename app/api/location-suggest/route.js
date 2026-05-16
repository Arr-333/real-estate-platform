import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

const getAll = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) return NextResponse.json([]);

    const cities = await prisma.city.findMany({
      where: {
        cityName: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: { state: true },
      take: 5,
    });

    const result = cities.map((c) => ({
      id: c.cityId,
      label: `${c.cityName}, ${c.state.stateName}`,
      lat: c.lat,
      lng: c.lng,
    }));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.location.getAll);
