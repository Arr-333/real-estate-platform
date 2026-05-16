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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const body = await req.json();
    const { propertyId } = body;

    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer profile not found" },
        { status: 400 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { propertyListId: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const brokerId = property.propertyBrokerId ?? null;
    const ownerId = property.ownerId;

    // ✅ FIX: check BEFORE create
    const existing = await prisma.clientActivity.findFirst({
      where: {
        customerId: customer.id,
        propertyId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already requested for this property" },
        { status: 400 }
      );
    }

    const activity = await prisma.clientActivity.create({
      data: {
        customerId: customer.id,
        propertyId,
        brokerId,
        ownerId,
        status: "INQUIRY",
      },
    });

    return NextResponse.json(activity);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

const getAll = async (req) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    const skip = (page - 1) * limit;

    const userId = Number(session.user.id);
    const role = session.user.role;

    let whereCondition = {};

    // ✅ KEEP OLD LOGIC (ROLE BASED)
    if (role === "BROKER") {
      const broker = await prisma.broker.findFirst({ where: { userId } });
      if (!broker) return NextResponse.json({ data: [], page, totalPages: 0 });

      whereCondition.brokerId = broker.id;
    } else if (role === "OWNER") {
      const owner = await prisma.owner.findFirst({ where: { userId } });
      if (!owner) return NextResponse.json({ data: [], page, totalPages: 0 });

      whereCondition.ownerId = owner.id;
    } else if (role === "CUSTOMER") {
      const customer = await prisma.customer.findFirst({ where: { userId } });
      if (!customer)
        return NextResponse.json({ data: [], page, totalPages: 0 });

      // 🔥 THIS IS YOUR MAIN REQUIREMENT
      whereCondition.customerId = customer.id;
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const total = await prisma.clientActivity.count({
      where: whereCondition,
    });

    const activities = await prisma.clientActivity.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        property: true,
        broker: { include: { user: true } },
        owner: { include: { user: true } },
        customer: { include: { user: true } },
      },
    });

    return NextResponse.json({
      data: activities,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.clientactivity.getAll);
export const POST = withAuth(create, ACCESS_CONTROL.clientactivity.create);
