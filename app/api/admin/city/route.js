import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { saveFile } from "../../../../src/lib/uploadFile";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

// POST add property type
const create = async (request) => {
  try {
    const formData = await request.formData();

    const cityName = formData.get("cityName");
    const stateId = formData.get("stateId");
    const file = formData.get("image");
    const lat = formData.get("lat");
    const lng = formData.get("lng");

    if (!cityName || !cityName.trim()) {
      return NextResponse.json(
        { message: "City name is required" },
        { status: 400 }
      );
    }

    if (!stateId) {
      return NextResponse.json(
        { message: "State ID is required" },
        { status: 400 }
      );
    }

    const imagePath = await saveFile(file, "", "city");

    const city = await prisma.city.create({
      data: {
        cityName: cityName.trim(),
        stateId: Number(stateId),
        image: imagePath,
        lat,
        lng,
      },
    });

    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "City already exists" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Failed to add City" },
      { status: 500 }
    );
  }
};

export const POST = withAuth(create, ACCESS_CONTROL.city.create);
