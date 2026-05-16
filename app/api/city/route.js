import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

const getAll = async () => {
  try {
    const cities = await prisma.city.findMany({
      include: { state: true },
    });
    return NextResponse.json(cities, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch cities" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.city.getAll);
