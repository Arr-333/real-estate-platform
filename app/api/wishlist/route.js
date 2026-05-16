import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../src/lib/auth";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

const create = async (req) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const { propertyId } = await req.json();

    // find customer
    const customer = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    // prevent duplicate
    const existing = await prisma.wishlist.findFirst({
      where: {
        customerId: customer.id,
        propertyId,
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Already in wishlist" });
    }

    await prisma.wishlist.create({
      data: {
        customerId: customer.id,
        propertyId,
      },
    });

    return NextResponse.json({ message: "Added to wishlist" });
  } catch (error) {
    console.error("WISHLIST ADD ERROR:", error);

    return NextResponse.json(
      { message: "Failed to add wishlist" },
      { status: 500 }
    );
  }
};

const remove = async (req) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const { propertyId } = await req.json();

    const customer = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    await prisma.wishlist.deleteMany({
      where: {
        customerId: customer.id,
        propertyId,
      },
    });

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("WISHLIST DELETE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to remove wishlist" },
      { status: 500 }
    );
  }
};

const getAll = async (req) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ data: [] });
    }

    const userId = Number(session.user.id);

    const { searchParams } = new URL(req.url);

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? parseInt(pageParam) : null;
    const limit = limitParam ? parseInt(limitParam) : null;

    const skip = page && limit ? (page - 1) * limit : undefined;

    /* ------------------ CUSTOMER ------------------ */
    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json({ data: [] });
    }

    /* ------------------ OLD LOGIC (NO PAGINATION) ------------------ */
    if (!page || !limit) {
      const wishlist = await prisma.wishlist.findMany({
        where: { customerId: customer.id },
        select: { propertyId: true },
      });

      return NextResponse.json({
        data: wishlist.map((w) => w.propertyId),
      });
    }

    /* ------------------ NEW LOGIC (PAGINATION + FULL DATA) ------------------ */
    const [wishlist, total] = await Promise.all([
      prisma.wishlist.findMany({
        where: { customerId: customer.id },
        skip,
        take: limit,
        orderBy: { id: "desc" },

        include: {
          property: {
            include: {
              images: true,
              city: true,
              propertyType: true,
            },
          },
        },
      }),

      prisma.wishlist.count({
        where: { customerId: customer.id },
      }),
    ]);

    return NextResponse.json({
      data: wishlist.map((w) => w.property), // ✅ direct property
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("WISHLIST GET ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.wishlist.getAll);
export const POST = withAuth(create, ACCESS_CONTROL.wishlist.create);
export const DELETE = withAuth(remove, ACCESS_CONTROL.wishlist.delete);
