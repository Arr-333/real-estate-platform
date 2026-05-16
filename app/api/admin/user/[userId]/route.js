import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { saveFile } from "../../../../../src/lib/uploadFile";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";

// ------------------- GET USER BY ID -------------------
const getSingle = async (request, context) => {
  const id = await params;
  const userId = parseInt(id.userId, 10);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
};

// ------------------- DELETE USER -------------------
const remove = async (request, context) => {
  const id = await params;
  const userId = parseInt(id.userId, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Delete image
    try {
      await saveFile(null, user.pic, "user", true);
    } catch (err) {
      console.warn("Error deleting image:", err.message);
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: `User with ID ${userId} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getSingle, ACCESS_CONTROL.user.getSingle);

export const DELETE = withAuth(remove, ACCESS_CONTROL.user.delete);
