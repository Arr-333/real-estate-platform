import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { saveFile } from "../../../../../src/lib/uploadFile";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";

const getSingle = async (request, context) => {
  try {
    const cityId = await context.params;
    const id = Number(cityId.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid City id" }, { status: 400 });
    }

    const city = await prisma.city.findUnique({
      where: { cityId: id },
      include: {
        state: true, // include state relation if you have it
      },
    });

    if (!city) {
      return NextResponse.json({ message: "City not found" }, { status: 404 });
    }

    return NextResponse.json(city, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch City" },
      { status: 500 }
    );
  }
};

const update = async (request, context) => {
  try {
    const cityId = await context.params;
    const id = Number(cityId.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid City id" }, { status: 400 });
    }
    const formData = await request.formData();
    const cityName = formData.get("cityName");
    const stateId = formData.get("stateId");
    const lat = formData.get("lat");
    const lng = formData.get("lng");
    const file = formData.get("image");

    const existing = await prisma.city.findUnique({
      where: { cityId: id },
    });

    const imagePath = await saveFile(file, existing.image, "city");

    if (!cityName || !cityName.trim()) {
      return NextResponse.json(
        { message: "City name is required" },
        { status: 400 }
      );
    }

    const updatedCity = await prisma.city.update({
      where: { cityId: id },
      data: {
        cityName: cityName.trim(),
        stateId: stateId ? Number(stateId) : undefined,
        image: imagePath,
        lat: lat,
        lng: lng,
      },
    });
    return NextResponse.json(updatedCity, { status: 200 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "City already exists" },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ message: "City not found" }, { status: 404 });
    }

    console.log(error);
    return NextResponse.json(
      { message: "Failed to update City" },
      { status: 500 }
    );
  }
};

// DELETE subscriber
const remove = async (request, context) => {
  try {
    const cityId = await context.params; // FIX
    const id = Number(cityId.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid City id" }, { status: 400 });
    }

    const existing = await prisma.city.findUnique({
      where: { cityId: id },
    });

    await saveFile(null, existing.image, "city", true);

    await prisma.city.delete({ where: { cityId: id } });
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete City" },
      { status: 500 }
    );
  }
};
//
export const GET = withAuth(getSingle, ACCESS_CONTROL.city.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.city.update);

export const DELETE = withAuth(remove, ACCESS_CONTROL.city.delete);
