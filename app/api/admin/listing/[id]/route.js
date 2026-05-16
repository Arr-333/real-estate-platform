import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";
import { PropertyListStatus } from "@prisma/client";

const update = async (request, context) => {
  try {
    const params = await context.params;
    const id = Number(params.id);
    console.log(id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid Property id" },
        { status: 400 }
      );
    }

    const payload = await request.json();

    if (!payload.status) {
      return NextResponse.json(
        { message: "Property status is required" },
        { status: 400 }
      );
    }

    // Validate Enum
    if (!Object.values(PropertyListStatus).includes(payload.status)) {
      return NextResponse.json(
        { message: "Invalid property status value" },
        { status: 400 }
      );
    }

    const updatedProperty = await prisma.property.update({
      where: { propertyListId: id },
      data: {
        propertyListStatus: payload.status,
      },
    });

    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { message: "Failed to update property status" },
      { status: 500 }
    );
  }
};

export const PUT = withAuth(update, ACCESS_CONTROL.listing.update);
