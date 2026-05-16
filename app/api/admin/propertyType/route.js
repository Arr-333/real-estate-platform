import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveFile } from "@/lib/uploadFile";
import { withAuth } from "@/lib/withAuth";
import { ACCESS_CONTROL } from "@/lib/accessControl";

// POST add property type
const create = async (request) => {
  try {
    // 1️⃣ AUTH CHECK
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const formData = await request.formData();
    const name = formData.get("name");
    const file = formData.get("image");

    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: "Property type name is required" },
        { status: 400 }
      );
    }

    const imagePath = await saveFile(file, "", "propertyType");

    const propertyType = await prisma.propertyType.create({
      data: {
        name: name.trim(),
        status: "COMING_SOON",
        image: imagePath,
        createdById: userId, //  session
      },
    });

    return NextResponse.json(propertyType, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Property type already exists" },
        { status: 409 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { message: "Failed to add Property Type" },
      { status: 500 }
    );
  }
};

export const POST = withAuth(create, ACCESS_CONTROL.propertyType.create);
