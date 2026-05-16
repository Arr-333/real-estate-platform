import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { saveFile } from "../../../../../src/lib/uploadFile";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";

//Update  GET

const getSingle = async (request, context) => {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid State id" },
        { status: 400 }
      );
    }

    const state = await prisma.state.findUnique({
      where: { stateId: id },
    });

    if (!state) {
      return NextResponse.json({ message: "State not found" }, { status: 404 });
    }

    return NextResponse.json(state, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch state" },
      { status: 500 }
    );
  }
};

const update = async (request, context) => {
  const params = await context.params;
  const id = Number(params.id);

  try {
    if (!id) {
      return NextResponse.json(
        { message: "Invalid State id" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const stateName = formData.get("stateName");
    const stateStatus = formData.get("stateStatus");
    const file = formData.get("image");

    const existing = await prisma.state.findUnique({
      where: { stateId: id },
    });

    if (!existing) {
      return NextResponse.json({ message: "State not found" }, { status: 404 });
    }
    // Update name only if provided and not empty
    if (!stateName || !stateName.trim()) {
      return NextResponse.json(
        { message: "State name is required" },
        { status: 400 }
      );
    }
    const imagePath = await saveFile(file, existing.image, "state");

    const updatedstate = await prisma.state.update({
      where: { stateId: id },
      data: {
        stateName: stateName.trim(),
        stateStatus: stateStatus ?? existing.stateStatus,
        image: imagePath,
      },
    });
    return NextResponse.json(
      updatedstate,
      { message: "State updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "State already exists" },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json({ message: "State not found" }, { status: 404 });
    }

    console.error(error);
    return NextResponse.json(
      { message: "Failed to update State" },
      { status: 500 }
    );
  }
};

// DELETE subscriber
const remove = async (request, context) => {
  try {
    const stateId = await context.params; // FIX
    const id = Number(stateId.id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid State id" },
        { status: 400 }
      );
    }

    const existing = await prisma.state.findUnique({
      where: { stateId: id },
    });
    if (!existing) {
      return NextResponse.json({ message: "State not found" }, { status: 404 });
    }

    await saveFile(null, existing.image, "state", true);

    await prisma.state.delete({ where: { stateId: id } });
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete State" },
      { status: 500 }
    );
  }
};
//

export const GET = withAuth(getSingle, ACCESS_CONTROL.state.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.state.update);

export const DELETE = withAuth(remove, ACCESS_CONTROL.state.delete);
