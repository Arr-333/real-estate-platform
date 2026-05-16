import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../src/lib/auth";
import { Prisma } from "@prisma/client";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

const getAll = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session ? Number(session.user.id) : null;

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    // Filters
    const propertyType = searchParams.get("propertyType");
    const location = searchParams.get("location");
    const minRent = searchParams.get("minRent");
    const maxRent = searchParams.get("maxRent");

    const status = searchParams.get("status");

    let whereCondition = {
      propertyListStatus: status ? status : "ACTIVE",
    };

    let andConditions = [];

    /* ------------------ PROPERTY TYPE ------------------ */
    if (propertyType) {
      andConditions.push({
        propertyType: {
          is: {
            name: propertyType,
          },
        },
      });
    }

    /* ------------------ LOCATION ------------------ */
    if (location) {
      const search = location.trim();

      andConditions.push({
        OR: [
          { propertyAddressLine1: { contains: search } },
          { propertyAddressLine2: { contains: search } },
          { propertyLocal: { contains: search } },
          {
            city: {
              // ✅ safe relation usage
              cityName: {
                contains: search,
              },
            },
          },
        ],
      });
    }

    /* ------------------ BUDGET FILTER ------------------ */
    if (minRent || maxRent) {
      const rentFilter = {};

      // 👉 SAFE for INT field
      if (minRent && !isNaN(minRent)) {
        rentFilter.gte = new Prisma.Decimal(minRent);
      }

      if (maxRent && !isNaN(maxRent)) {
        rentFilter.lte = new Prisma.Decimal(maxRent);
      }

      // Only push if valid
      if (Object.keys(rentFilter).length > 0) {
        andConditions.push({
          propertyRent: rentFilter,
        });
      }
    }

    /* ------------------ APPLY FILTERS ------------------ */
    if (andConditions.length > 0) {
      whereCondition.AND = andConditions;
    }

    /* ------------------ QUERY ------------------ */
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { propertyCreatedOn: "desc" },
        include: {
          images: true,
          propertyType: true,
          city: true,

          // ✅ Optional wishlist support
          ...(userId && {
            wishlists: {
              where: { customerId: userId },
              select: { id: true },
            },
          }),
        },
      }),

      prisma.property.count({ where: whereCondition }),
    ]);

    /* ------------------ RESPONSE ------------------ */
    return NextResponse.json({
      data: properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("PUBLIC PROP ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch properties" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.publicprop.getAll);
