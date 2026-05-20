import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

// =========================
// GET all demographics
// =========================
const getAll = async () => {
  try {
    const data = await prisma.demographics.findMany();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch demographics" },
      { status: 500 }
    );
  }
};

// =========================
// POST create demographics
// =========================
const create = async (request) => {
  try {
    const payload = await request.json();

    const created = await prisma.demographics.create({
      data: {
        latitude: payload.latitude,
        longitude: payload.longitude,

        radius1Color: payload.radius1Color || "red",
        radius3Color: payload.radius3Color || "orange",
        radius5Color: payload.radius5Color || "yellow",

        absolutePopulationJson: payload.absolutePopulationJson,
        householdIncomeJson: payload.householdIncomeJson,
        consumerSpendingJson: payload.consumerSpendingJson,

        tableRowsJson: payload.tableRowsJson, // <-- array of rows
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { message: "Failed to create demographics", error: error.message },
      { status: 500 }
    );
  }
};
//
export const POST = withAuth(create, ACCESS_CONTROL.demography.create);
export const GET = withAuth(getAll, ACCESS_CONTROL.demography.getAll);
