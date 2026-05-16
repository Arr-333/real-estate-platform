import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { saveFile } from "../../../../../src/lib/uploadFile";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";

const getSingle = async (request, context) => {
  try {
    const { id } = await context.params;
    const propertyId = Number(id);

    if (!propertyId) {
      return NextResponse.json(
        { message: "Invalid Property Type id" },
        { status: 400 }
      );
    }

    const propertyType = await prisma.propertyType.findUnique({
      where: { id: propertyId },
    });

    if (!propertyType) {
      return NextResponse.json(
        { message: "Property Type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(propertyType, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch Role" },
      { status: 500 }
    );
  }
};

const update = async (request, context) => {
  try {
    const propertyId = await context.params;
    const id = Number(propertyId.id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid property type id" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const status = formData.get("status");
    const file = formData.get("image");

    const existing = await prisma.propertyType.findUnique({
      where: { id },
    });

    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: "Property type name is required" },
        { status: 400 }
      );
    }

    const imagePath = await saveFile(file, existing.image, "propertyType");

    const updatedpropertyType = await prisma.propertyType.update({
      where: { id },
      data: {
        name: name.trim(),
        status,
        image: imagePath,
      },
    });
    return NextResponse.json(updatedpropertyType, { status: 200 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Property type already exists" },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Property type not found" },
        { status: 404 }
      );
    }

    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch Property Type" },
      { status: 500 }
    );
  }
};

// DELETE subscriber
const remove = async (request, context) => {
  try {
    const propertyId = await context.params; // FIX
    const id = Number(propertyId.id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid property type id" },
        { status: 400 }
      );
    }
    const existing = await prisma.propertyType.findUnique({
      where: { id },
    });

    await saveFile(null, existing.image, "propertyType", true);
    await prisma.propertyType.delete({ where: { id } });
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete Properrty" },
      { status: 500 }
    );
  }
};
//
export const GET = withAuth(getSingle, ACCESS_CONTROL.propertyType.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.propertyType.update);

export const DELETE = withAuth(remove, ACCESS_CONTROL.propertyType.delete);
