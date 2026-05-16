import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { saveFile } from "../../../src/lib/uploadFile";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";
import {
  Prisma,
  FurnishedStatus,
  RentalTerm,
  AvailabilityStatus,
  PropertyListStatus,
  RentType,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../src/lib/auth";

const create = async (request) => {
  try {
    // ===============================
    // 1️⃣ AUTH CHECK
    // ===============================

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const formData = await request.formData();

    // ===============================
    // 2️⃣ EXTRACT & VALIDATE REQUIRED FIELDS
    // ===============================

    const propertyTitle = formData.get("propertyTitle");
    const propertyTypeId = Number(formData.get("propertyTypeId"));
    const propertyCityId = Number(formData.get("propertyCityId"));
    const propertyStateId = Number(formData.get("propertyStateId"));
    const propertyRentRaw = formData.get("propertyRent");
    const broker = await prisma.broker.findUnique({
      where: { userId: userId },
    });

    // if (!broker) {
    //   return NextResponse.json(
    //     { message: "Broker not found for this user" },
    //     { status: 400 }
    //   );
    // }

    if (
      !propertyTitle ||
      !propertyTypeId ||
      !propertyCityId ||
      !propertyStateId ||
      !propertyRentRaw
    ) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }

    // ===============================
    // 3️⃣ ENUM VALIDATION
    // ===============================

    const furnishedStatus = formData.get("propertyFurnishedStatus");
    const rentalTerm = formData.get("propertyRentalTerm");
    const availability = formData.get("propertyAvailability");
    const listStatus = formData.get("propertyListStatus");
    const rentType = formData.get("propertyRentType");

    if (!Object.values(FurnishedStatus).includes(furnishedStatus)) {
      return NextResponse.json(
        { message: "Invalid furnished status" },
        { status: 400 }
      );
    }

    if (!Object.values(RentalTerm).includes(rentalTerm)) {
      return NextResponse.json(
        { message: "Invalid rental term" },
        { status: 400 }
      );
    }

    if (!Object.values(AvailabilityStatus).includes(availability)) {
      return NextResponse.json(
        { message: "Invalid availability status" },
        { status: 400 }
      );
    }

    if (!Object.values(PropertyListStatus).includes(listStatus)) {
      return NextResponse.json(
        { message: "Invalid property list status" },
        { status: 400 }
      );
    }

    if (rentType && !Object.values(RentType).includes(rentType)) {
      return NextResponse.json(
        { message: "Invalid rent type" },
        { status: 400 }
      );
    }

    // ===============================
    // 4️⃣ HANDLE IMAGE UPLOAD
    // ===============================

    const imageFiles = formData.getAll("images");
    const savedImages = [];

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const imagePath = await saveFile(file, "", "property");
        savedImages.push({
          imageUrl: imagePath,
          imageType: "PROPERTY_IMAGE",
        });
      }
    }

    // ===============================
    // 5️⃣ HANDLE DOCUMENT UPLOAD
    // ===============================

    const docFiles = formData.getAll("documents");

    const savedDocuments = [];

    for (const file of docFiles) {
      if (file && file.size > 0) {
        const docPath = await saveFile(file, "", "propertyDocs");
        savedDocuments.push({
          docUrl: docPath,
          docType: "PROPERTY_DOC",
        });
      }
    }

    const suitabilityItems = formData.getAll("propertySuitability");
    const nearbyItems = formData.getAll("propertyNearby");
    const highlightsItems = JSON.parse(formData.get("highlights") || "[]");
    const spacesItems = JSON.parse(formData.get("spaces") || "[]");

    // ===============================
    // 6️⃣ CREATE PROPERTY (TRANSACTION SAFE)
    // ===============================

    const property = await prisma.$transaction(async (tx) => {
      return await tx.property.create({
        data: {
          propertyTitle,

          propertySize: formData.get("propertySize")
            ? Number(formData.get("propertySize"))
            : 0,

          propertyDimension: formData.get("propertyDimension")
            ? Number(formData.get("propertyDimension"))
            : null,

          propertyType: {
            connect: { id: propertyTypeId },
          },

          city: {
            connect: { cityId: propertyCityId },
          },

          state: {
            connect: { stateId: propertyStateId },
          },

          ...(broker && {
            broker: {
              connect: { id: broker.id },
            },
          }),

          creator: { connect: { id: userId } },
          updater: { connect: { id: userId } },

          propertyFurnishedStatus: furnishedStatus,

          propertyHasPantryArea:
            formData.get("propertyHasPantryArea") === "true",

          propertyHasWashArea: formData.get("propertyHasWashArea") === "true",

          propertyNoOfWashAreas: formData.get("propertyNoOfWashAreas")
            ? Number(formData.get("propertyNoOfWashAreas"))
            : null,

          propertyRentalTerm: rentalTerm,

          propertyRent: new Prisma.Decimal(propertyRentRaw),

          propertyRentType: rentType || null,

          propertyAvailability: availability,

          propertyAvailabilityDate: formData.get("propertyAvailabilityDate")
            ? new Date(formData.get("propertyAvailabilityDate"))
            : null,

          propertyAddressLine1: formData.get("propertyAddressLine1"),

          propertyAddressLine2: formData.get("propertyAddressLine2"),

          propertyAddressLine3: formData.get("propertyAddressLine3"),

          propertyLocal: formData.get("propertyLocal"),

          propertyLatitude: formData.get("propertyLatitude"),

          propertyLongitude: formData.get("propertyLongitude"),

          propertyOwnerName: formData.get("propertyOwnerName"),

          propertyOwnerContactEmail: formData.get("propertyOwnerContactEmail"),

          propertyOwnerContactPhone: formData.get("propertyOwnerContactPhone"),

          propertyRegistration: formData.get("propertyRegistration") === "true",

          propertyRegistrationDetails: formData.get(
            "propertyRegistrationDetails"
          ),

          propertyRegistrationAuthority: formData.get(
            "propertyRegistrationAuthority"
          ),

          propertyRegistrationVerified:
            formData.get("propertyRegistrationVerified") === "true",

          propertyDescriptionContent: formData.get(
            "propertyDescriptionContent"
          ),

          propertyAbout: formData.get("propertyAbout"),

          propertyListStatus: listStatus,

          images: { create: savedImages },
          documents: { create: savedDocuments },

          suitability: {
            create: suitabilityItems
              .filter((item) => item.trim() !== "")
              .map((item) => ({
                name: item,
              })),
          },

          nearby: {
            create: nearbyItems
              .filter((item) => item.trim() !== "")
              .map((item) => ({
                placeName: item,
              })),
          },
          highlights: {
            create: highlightsItems
              .filter((item) => item.trim() !== "")
              .map((text) => ({
                text,
              })),
          },
          spaces: {
            create: spacesItems.map((space) => ({
              name: space.id,
              size: space.size,
              term: space.term,
              rate: new Prisma.Decimal(space.rate),
              use: space.use,
              condition: space.condition,
              available: space.available,
              description: space.desc,
              features: {
                create: (space.features || []).map((f) => ({
                  name: f,
                })),
              },
            })),
          },
        },
        include: {
          images: true,
          documents: true,
        },
      });
    });

    return NextResponse.json(
      { message: "Property created successfully", property },
      { status: 201 }
    );
  } catch (error) {
    console.error("PROPERTY CREATE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to create property" },
      { status: 500 }
    );
  }
};

const getAll = async (req) => {
  try {
    // ===============================
    // 1️⃣ AUTH
    // ===============================
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const role = session.user.role;

    // ===============================
    // 2️⃣ QUERY PARAMS (SAFE)
    // ===============================
    const { searchParams } = new URL(req.url);

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const status = searchParams.get("status");

    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = limitParam ? parseInt(limitParam) : null;

    const isValidPage = Number.isInteger(page) && page > 0;
    const isValidLimit = Number.isInteger(limit) && limit > 0;

    const skip = isValidPage && isValidLimit ? (page - 1) * limit : undefined;

    // ===============================
    // 3️⃣ ROLE-BASED FILTER
    // ===============================
    let whereCondition = {};

    switch (role) {
      case "ADMIN":
        break;

      case "BROKER": {
        const broker = await prisma.broker.findUnique({
          where: { userId },
        });

        if (!broker) {
          return NextResponse.json({
            data: [],
            total: 0,
            page,
            totalPages: 0,
            stats: {},
          });
        }

        whereCondition.broker = {
          id: broker.id,
        };
        break;
      }

      case "OWNER":
        whereCondition.createdBy = userId;
        break;

      case "CUSTOMER":
        whereCondition.propertyListStatus = "ACTIVE";
        break;

      default:
        return NextResponse.json({ message: "Invalid role" }, { status: 403 });
    }

    // ===============================
    // 4️⃣ OPTIONAL FILTERS
    // ===============================
    if (status) {
      whereCondition.propertyListStatus = status;
    }

    // ===============================
    // 5️⃣ FETCH DATA (FIXED)
    // ===============================
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: whereCondition,
        ...(skip !== undefined && { skip }),
        ...(isValidLimit && { take: limit }),
        orderBy: { propertyCreatedOn: "desc" },
        include: {
          images: true,
          propertyType: true,
        },
      }),
      prisma.property.count({ where: whereCondition }),
    ]);

    // ===============================
    // 6️⃣ STATUS STATS
    // ===============================
    const statsData = await prisma.property.findMany({
      where: whereCondition,
      select: { propertyListStatus: true },
    });

    const stats = {
      ACTIVE: 0,
      DEACTIVE: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      PENDING_SITE_VISIT: 0,
      APPROVED_SITE_VISIT: 0,
      REJECTED_SITE_VISIT: 0,
      IN_PROGRESS: 0,
      PROCESSING: 0,
      SOLD: 0,
    };

    statsData.forEach((item) => {
      const status = item.propertyListStatus;
      if (!status) return;

      stats[status] = (stats[status] || 0) + 1;
    });

    // ===============================
    // 7️⃣ RESPONSE
    // ===============================
    return NextResponse.json({
      data: properties,
      total,
      page,
      totalPages: isValidLimit ? Math.ceil(total / limit) : 1,
      stats,
    });
  } catch (error) {
    console.error("GET LISTING ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch properties" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.listing.getAll);
export const POST = withAuth(create, ACCESS_CONTROL.listing.create);
