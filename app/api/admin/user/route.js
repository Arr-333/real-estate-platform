import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import bcrypt from "bcrypt";
import passwordValidator from "password-validator";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

const getAll = async () => {
  try {
    const { searchParams } = new URL(req.url);

    // ✅ pagination params
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { id: "desc" },
        include: {
          role: true,
        },
      }),

      prisma.user.count(),
    ]);

    return NextResponse.json({
      data: users,
      total, // 🔥 REQUIRED for DataGrid
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.user.getAll);
