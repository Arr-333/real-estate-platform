import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { saveFile } from "../../../../src/lib/uploadFile";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

// POST add property type
const createState = async (request) => {
  try {
    const formData = await request.formData();
    const stateName = formData.get("stateName");
    const file = formData.get("image");

    if (!stateName || !stateName.trim()) {
      return NextResponse.json(
        { message: "State name is required" },
        { status: 400 }
      );
    }
    const imagePath = await saveFile(file, "", "state");

    const state = await prisma.state.create({
      data: {
        stateName: stateName.trim(),
        stateStatus: "ComingSoon",
        image: imagePath,
      },
    });

    return NextResponse.json(state, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "State already exists" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Failed to add States" },
      { status: 500 }
    );
  }
};
export const POST = withAuth(createState, ACCESS_CONTROL.state.create);
