import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { saveFile } from "../../../../src/lib/uploadFile";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";
import {
  Prisma,
  FurnishedStatus,
  RentalTerm,
  AvailabilityStatus,
  PropertyListStatus,
  RentType,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const update = async (request, context) => {
  try {
    const params = await context.params;
    const propertyId = Number(params.id);

    if (!propertyId || isNaN(propertyId)) {
      return NextResponse.json(
        { message: "Invalid property id" },
        { status: 400 }
      );
    }

    //-----------------------------------
    // AUTH
    //-----------------------------------
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { message: "Invalid session user id" },
        { status: 400 }
      );
    }

    //-----------------------------------
    // EXISTING PROPERTY
    //-----------------------------------
    const existingProperty = await prisma.property.findUnique({
      where: {
        propertyListId: propertyId,
      },
      include: {
        images: true,
        documents: true,
        highlights: true,
        nearby: true,
        suitability: true,
        spaces: {
          include: {
            features: true,
          },
        },
      },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    //-----------------------------------
    // ENUM VALUES
    //-----------------------------------
    const furnishedStatus = formData.get("propertyFurnishedStatus");
    const rentalTerm = formData.get("propertyRentalTerm");
    const availability = formData.get("propertyAvailability");
    const listStatus = formData.get("propertyListStatus");
    const rentType = formData.get("propertyRentType");

    //-----------------------------------
    // ENUM VALIDATION
    //-----------------------------------
    if (
      furnishedStatus &&
      !Object.values(FurnishedStatus).includes(furnishedStatus)
    ) {
      return NextResponse.json(
        { message: "Invalid furnished status" },
        { status: 400 }
      );
    }

    if (rentalTerm && !Object.values(RentalTerm).includes(rentalTerm)) {
      return NextResponse.json(
        { message: "Invalid rental term" },
        { status: 400 }
      );
    }

    if (
      availability &&
      !Object.values(AvailabilityStatus).includes(availability)
    ) {
      return NextResponse.json(
        { message: "Invalid availability status" },
        { status: 400 }
      );
    }

    if (listStatus && !Object.values(PropertyListStatus).includes(listStatus)) {
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

    //-----------------------------------
    // IMAGE UPDATE
    //-----------------------------------
    const imageFiles = formData.getAll("images");
    let savedImages = [];

    if (imageFiles.length > 0 && imageFiles[0]?.size > 0) {
      await prisma.propertyImage.deleteMany({
        where: {
          propertyId,
        },
      });

      for (const file of imageFiles) {
        const imagePath = await saveFile(
          file,
          existingProperty.images[0]?.imageUrl || "",
          "property"
        );

        savedImages.push({
          imageUrl: imagePath,
          imageType: "PROPERTY_IMAGE",
        });
      }
    }

    //-----------------------------------
    // DOCUMENT UPDATE
    //-----------------------------------
    const documentFiles = formData.getAll("documents");
    let savedDocuments = [];

    if (documentFiles.length > 0 && documentFiles[0]?.size > 0) {
      await prisma.propertyDocument.deleteMany({
        where: {
          propertyId,
        },
      });

      for (const file of documentFiles) {
        const docPath = await saveFile(
          file,
          existingProperty.documents[0]?.docUrl || "",
          "propertyDocs"
        );

        savedDocuments.push({
          docUrl: docPath,
          docType: "PROPERTY_DOC",
        });
      }
    }

    //-----------------------------------
    // ARRAY DATA
    //-----------------------------------
    const hasHighlights = formData.has("highlights");
    const hasNearby = formData.has("nearby");
    const hasSuitability = formData.has("suitability");
    const hasSpaces = formData.has("spaces");

    const parseJsonField = (fieldName) => {
      try {
        const value = formData.get(fieldName);

        if (!value || value === "undefined" || value === "null") {
          return [];
        }

        return JSON.parse(value);
      } catch (error) {
        console.log(`${fieldName} parse error:`, error);
        return [];
      }
    };

    const highlights = hasHighlights ? parseJsonField("highlights") : [];

    const nearby = hasNearby ? parseJsonField("nearby") : [];

    const suitability = hasSuitability ? parseJsonField("suitability") : [];

    const spaces = hasSpaces ? parseJsonField("spaces") : [];

    //-----------------------------------
    // TRANSACTION
    //-----------------------------------
    const updatedProperty = await prisma.$transaction(async (tx) => {
      if (hasHighlights) {
        await tx.propertyHighlight.deleteMany({
          where: { propertyId },
        });
      }

      if (hasNearby) {
        await tx.propertyNearby.deleteMany({
          where: { propertyId },
        });
      }

      if (hasSuitability) {
        await tx.propertySuitability.deleteMany({
          where: { propertyId },
        });
      }

      if (hasSpaces) {
        await tx.propertySpace.deleteMany({
          where: { propertyId },
        });
      }

      return await tx.property.update({
        where: {
          propertyListId: propertyId,
        },
        data: {
          //-----------------------------------
          // Foreign Keys
          //-----------------------------------
          propertyTypeId: formData.has("propertyTypeId")
            ? Number(formData.get("propertyTypeId"))
            : existingProperty.propertyTypeId,

          propertyCityId: formData.has("propertyCityId")
            ? Number(formData.get("propertyCityId"))
            : existingProperty.propertyCityId,

          propertyStateId: formData.has("propertyStateId")
            ? Number(formData.get("propertyStateId"))
            : existingProperty.propertyStateId,

          propertyBrokerId: formData.has("propertyBrokerId")
            ? Number(formData.get("propertyBrokerId"))
            : existingProperty.propertyBrokerId,

          ownerId: formData.has("ownerId")
            ? Number(formData.get("ownerId"))
            : existingProperty.ownerId,

          //-----------------------------------
          // Basic Info
          //-----------------------------------
          propertyTitle: formData.has("propertyTitle")
            ? formData.get("propertyTitle")
            : existingProperty.propertyTitle,

          propertySize: formData.has("propertySize")
            ? Number(formData.get("propertySize"))
            : existingProperty.propertySize,

          propertyDimension: formData.has("propertyDimension")
            ? Number(formData.get("propertyDimension"))
            : existingProperty.propertyDimension,

          propertyRent: formData.has("propertyRent")
            ? new Prisma.Decimal(formData.get("propertyRent"))
            : existingProperty.propertyRent,

          //-----------------------------------
          // ENUMS
          //-----------------------------------
          propertyFurnishedStatus: formData.has("propertyFurnishedStatus")
            ? furnishedStatus
            : existingProperty.propertyFurnishedStatus,

          propertyRentalTerm: formData.has("propertyRentalTerm")
            ? rentalTerm
            : existingProperty.propertyRentalTerm,

          propertyAvailability: formData.has("propertyAvailability")
            ? availability
            : existingProperty.propertyAvailability,

          propertyListStatus: formData.has("propertyListStatus")
            ? listStatus
            : existingProperty.propertyListStatus,

          propertyRentType: formData.has("propertyRentType")
            ? rentType
            : existingProperty.propertyRentType,

          //-----------------------------------
          // Boolean Fields
          //-----------------------------------
          propertyHasPantryArea: formData.has("propertyHasPantryArea")
            ? formData.get("propertyHasPantryArea") === "true"
            : existingProperty.propertyHasPantryArea,

          propertyHasWashArea: formData.has("propertyHasWashArea")
            ? formData.get("propertyHasWashArea") === "true"
            : existingProperty.propertyHasWashArea,

          propertyRegistration: formData.has("propertyRegistration")
            ? formData.get("propertyRegistration") === "true"
            : existingProperty.propertyRegistration,

          propertyRegistrationVerified: formData.has(
            "propertyRegistrationVerified"
          )
            ? formData.get("propertyRegistrationVerified") === "true"
            : existingProperty.propertyRegistrationVerified,

          //-----------------------------------
          // Number Fields
          //-----------------------------------
          propertyNoOfWashAreas: formData.has("propertyNoOfWashAreas")
            ? Number(formData.get("propertyNoOfWashAreas"))
            : existingProperty.propertyNoOfWashAreas,

          //-----------------------------------
          // Dates
          //-----------------------------------
          propertyAvailabilityDate: formData.has("propertyAvailabilityDate")
            ? new Date(formData.get("propertyAvailabilityDate"))
            : existingProperty.propertyAvailabilityDate,

          propertyAvailabilityDateDate: formData.has(
            "propertyAvailabilityDateDate"
          )
            ? formData.get("propertyAvailabilityDateDate")
            : existingProperty.propertyAvailabilityDateDate,

          //-----------------------------------
          // Address
          //-----------------------------------
          propertyAddressLine1: formData.has("propertyAddressLine1")
            ? formData.get("propertyAddressLine1")
            : existingProperty.propertyAddressLine1,

          propertyAddressLine2: formData.has("propertyAddressLine2")
            ? formData.get("propertyAddressLine2")
            : existingProperty.propertyAddressLine2,

          propertyAddressLine3: formData.has("propertyAddressLine3")
            ? formData.get("propertyAddressLine3")
            : existingProperty.propertyAddressLine3,

          propertyLocal: formData.has("propertyLocal")
            ? formData.get("propertyLocal")
            : existingProperty.propertyLocal,

          propertyLatitude: formData.has("propertyLatitude")
            ? formData.get("propertyLatitude")
            : existingProperty.propertyLatitude,

          propertyLongitude: formData.has("propertyLongitude")
            ? formData.get("propertyLongitude")
            : existingProperty.propertyLongitude,

          propertyPO: formData.has("propertyPO")
            ? formData.get("propertyPO")
            : existingProperty.propertyPO,

          propertyGooglePO: formData.has("propertyGooglePO")
            ? formData.get("propertyGooglePO")
            : existingProperty.propertyGooglePO,

          //-----------------------------------
          // Owner
          //-----------------------------------
          propertyOwnerName: formData.has("propertyOwnerName")
            ? formData.get("propertyOwnerName")
            : existingProperty.propertyOwnerName,

          propertyOwnerContactEmail: formData.has("propertyOwnerContactEmail")
            ? formData.get("propertyOwnerContactEmail")
            : existingProperty.propertyOwnerContactEmail,

          propertyOwnerContactPhone: formData.has("propertyOwnerContactPhone")
            ? formData.get("propertyOwnerContactPhone")
            : existingProperty.propertyOwnerContactPhone,

          //-----------------------------------
          // Registration
          //-----------------------------------
          propertyRegistrationDetails: formData.has(
            "propertyRegistrationDetails"
          )
            ? formData.get("propertyRegistrationDetails")
            : existingProperty.propertyRegistrationDetails,

          propertyRegistrationAuthority: formData.has(
            "propertyRegistrationAuthority"
          )
            ? formData.get("propertyRegistrationAuthority")
            : existingProperty.propertyRegistrationAuthority,

          propertyOtherCertification: formData.has("propertyOtherCertification")
            ? formData.get("propertyOtherCertification")
            : existingProperty.propertyOtherCertification,

          //-----------------------------------
          // Content
          //-----------------------------------
          propertyDescriptionContent: formData.has("propertyDescriptionContent")
            ? formData.get("propertyDescriptionContent")
            : existingProperty.propertyDescriptionContent,

          propertyAbout: formData.has("propertyAbout")
            ? formData.get("propertyAbout")
            : existingProperty.propertyAbout,

          //-----------------------------------
          // Update User
          //-----------------------------------
          lastUpdatedBy: userId,

          //-----------------------------------
          // Images
          //-----------------------------------
          images:
            savedImages.length > 0
              ? {
                  create: savedImages,
                }
              : undefined,

          //-----------------------------------
          // Documents
          //-----------------------------------
          documents:
            savedDocuments.length > 0
              ? {
                  create: savedDocuments,
                }
              : undefined,

          //-----------------------------------
          // Highlights
          //-----------------------------------
          highlights: hasHighlights
            ? {
                create: highlights.map((item) => ({
                  text: item,
                })),
              }
            : undefined,

          //-----------------------------------
          // Nearby
          //-----------------------------------
          nearby: hasNearby
            ? {
                create: nearby.map((item) => ({
                  placeName: item,
                })),
              }
            : undefined,

          //-----------------------------------
          // Suitability
          //-----------------------------------
          suitability: hasSuitability
            ? {
                create: suitability.map((item) => ({
                  name: item,
                })),
              }
            : undefined,

          //-----------------------------------
          // Spaces
          //-----------------------------------
          spaces: hasSpaces
            ? {
                create: spaces.map((space) => ({
                  name: space.name,
                  size: Number(space.size),
                  term: space.term,
                  rate: new Prisma.Decimal(space.rate),
                  use: space.use,
                  condition: space.condition,
                  available: space.available,
                  description: space.description,

                  features: {
                    create:
                      space.features?.map((feature) => ({
                        name: feature,
                      })) || [],
                  },
                })),
              }
            : undefined,
        },

        include: {
          images: true,
          documents: true,
          highlights: true,
          nearby: true,
          suitability: true,
          spaces: {
            include: {
              features: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        message: "Property updated successfully",
        updatedProperty,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update property",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

const getSingle = async (request, context) => {
  try {
    const propertyId = await context.params; // FIX
    const id = Number(propertyId.id);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid property ID" },
        { status: 400 }
      );
    }

    const property = await prisma.property.findFirst({
      where: {
        propertyListId: id,
        propertyListStatus: {
          in: ["ACTIVE", "ACCEPTED"],
        },
      },

      include: {
        // 🔥 REQUIRED FOR UI,
        images: true,
        documents: true,

        propertyType: true,
        city: true,
        state: true,

        // 🔥 TABS DATA
        highlights: true,
        suitability: true,
        nearby: true,

        // 🔥 SPACES TABLE
        spaces: {
          include: {
            features: true,
          },
        },

        // 🔥 SIDEBAR
        broker: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { message: "Property not found or not verified" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Property fetched successfully", property },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch property " },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getSingle, ACCESS_CONTROL.listing.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.listing.update);
