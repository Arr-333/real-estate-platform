import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";

const getSingle = async (request, context) => {
  try {
    const { id } = context.params;
    const roleId = Number(id);

    if (!roleId) {
      return NextResponse.json({ message: "Invalid Role id" }, { status: 400 });
    }

    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(role, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch Role" },
      { status: 500 }
    );
  }
};
//Update  GET
const update = async (request, context) => {
  try {
    const roleId = await context.params;
    const id = Number(roleId.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid Role id" }, { status: 400 });
    }
    const payload = await request.json();

    if (!payload.name || !payload.name.trim()) {
      return NextResponse.json(
        { message: "Role type name is required" },
        { status: 400 }
      );
    }

    const updatedrole = await prisma.role.update({
      where: { id },
      data: {
        name: payload.name.trim().toUpperCase(),
        isPublic: payload.isPublic,
      },
    });
    return NextResponse.json(updatedrole, { status: 200 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Role type already exists" },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Role type not found" },
        { status: 404 }
      );
    }

    console.log(error);
    return NextResponse.json(
      { message: "Failed to update Role Type" },
      { status: 500 }
    );
  }
};

// DELETE subscriber
const remove = async (request, context) => {
  try {
    const roleId = await context.params; // FIX
    const id = Number(roleId.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid Role id" }, { status: 400 });
    }
    await prisma.role.delete({ where: { id } });
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
export const GET = withAuth(getSingle, ACCESS_CONTROL.role.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.role.update);

export const DELETE = withAuth(remove, ACCESS_CONTROL.role.delete);
