import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

// GET all Brokers
const getAll = async () => {
  try {
    const brokers = await prisma.broker.findMany();
    return NextResponse.json(brokers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch brokers" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.broker.getAll);
