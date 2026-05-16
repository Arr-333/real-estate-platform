import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { saveFile } from "../../../src/lib/uploadFile";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

const getAll = async () => {
  try {
    const states = await prisma.state.findMany({
      include: { cities: true },
    });
    return NextResponse.json(states, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch State" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.state.getAll);
