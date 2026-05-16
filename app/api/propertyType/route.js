import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

// GET all property types
const getAll = async () => {
  try {
    const propertyTypes = await prisma.propertyType.findMany({
      include: {
        createdBy: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(propertyTypes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch Property Types" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.propertyType.getAll);
