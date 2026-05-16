import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

const getAll = async () => {
  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch Roles" },
      { status: 500 }
    );
  }
};

// POST add property type
const create = async (request) => {
  try {
    const payload = await request.json();

    if (!payload.name || !payload.name.trim()) {
      return NextResponse.json(
        { message: "Role name is required" },
        { status: 400 }
      );
    }

    const role = await prisma.role.create({
      data: {
        name: payload.name.trim().toUpperCase(),
      },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Role type already exists" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Failed to add Role Types" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.role.getAll);
export const POST = withAuth(create, ACCESS_CONTROL.role.create);
