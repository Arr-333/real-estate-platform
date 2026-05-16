import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

// DELETE subscriber
const remove = async (request, context) => {
  try {
    const testimonialId = await context.params; // FIX
    const id = Number(testimonialId.id);

    await prisma.newsletter.delete({ where: { id } });
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
};
//
export const DELETE = withAuth(remove, ACCESS_CONTROL.newsletter.delete);
