import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";

// GET single demographics by ID
const getSingle = async (request, context) => {
  try {
    const params = await context.params;
    const id = Number(params.id);

    const item = await prisma.demographics.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { message: "Demographics entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch demographics" },
      { status: 500 }
    );
  }
};

// PUT update demographics

const update = async (request, context) => {
  try {
    const params = await context.params;
    const id = Number(params.id);
    const payload = await request.json();

    // Find existing data
    const oldData = await prisma.demographics.findUnique({ where: { id } });

    if (!oldData) {
      return NextResponse.json(
        { message: "Demographics entry not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.demographics.update({
      where: { id },
      data: {
        title: payload.title?.trim() ?? oldData.title,

        absolutePopulationJson:
          payload.absolutePopulationJson ?? oldData.absolutePopulationJson,
        householdIncomeJson:
          payload.householdIncomeJson ?? oldData.householdIncomeJson,
        consumerSpendingJson:
          payload.consumerSpendingJson ?? oldData.consumerSpendingJson,
        tableRowsJson: payload.tableRowsJson ?? oldData.tableRowsJson,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update demographics" },
      { status: 500 }
    );
  }
};

// DELETE demographics
const remove = async (request, context) => {
  try {
    const params = await context.params;
    const id = Number(params.id);

    await prisma.demographics.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete demographics" },
      { status: 500 }
    );
  }
};

//
export const GET = withAuth(getSingle, ACCESS_CONTROL.demography.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.demography.update);

export const DELETE = withAuth(remove, ACCESS_CONTROL.demography.delete);
