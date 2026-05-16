import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

// GET all company
const getAll = async () => {
  try {
    const company = await prisma.company.findMany();
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch company" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.company.getAll);
