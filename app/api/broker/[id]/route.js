import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import fs from "fs";
import path from "path";
import { saveFile } from "../../../../src/lib/uploadFile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

const getSingle = async (request, context) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  try {
    const broker = await prisma.broker.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!broker) {
      return NextResponse.json(
        { message: "broker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(broker, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch broker" },
      { status: 500 }
    );
  }
};

// PUT update broker
const update = async (request, context) => {
  try {
    const brokerId = await context.params; // FIX
    const id = Number(brokerId.id);
    const formData = await request.formData();
    // Get old data
    const broker = await prisma.broker.findUnique({ where: { id } });

    if (!broker) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const newImageFile = formData.get("image");
    const image = await saveFile(newImageFile, broker.image, "broker");

    const updatedbroker = await prisma.broker.update({
      where: { id },
      data: {
        name: formData.get("name")?.trim() ?? broker.name,
        email: formData.get("email")?.trim() ?? broker.email,
        location: formData.get("location")?.trim() ?? broker.location,
        phoneOffice: formData.get("phoneOffice")?.trim() ?? broker.phoneOffice,
        phoneMobile: formData.get("phoneMobile")?.trim() ?? broker.phoneMobile,
        about: formData.get("about")?.trim() ?? broker.about,
        language: formData.get("language")?.trim() ?? broker.language,
        bio: formData.get("bio")?.trim() ?? broker.bio,

        image: image ?? broker.image,
      },
    });

    return NextResponse.json(updatedbroker, { status: 200, update: formData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update broker" },
      { status: 500 }
    );
  }
};
export const GET = withAuth(getSingle, ACCESS_CONTROL.broker.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.broker.update);
