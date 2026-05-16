import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

// POST add subscriber
const getAll = async (request) => {
  try {
    const payload = await request.json();

    const subscriber = await prisma.newsletter.create({
      data: { email: payload.email?.trim() },
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to add subscriber" },
      { status: 500 }
    );
  }
};
//
export const GET = withAuth(getAll, ACCESS_CONTROL.newsletter.getAll);
