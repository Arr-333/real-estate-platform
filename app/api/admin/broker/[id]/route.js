import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";
import fs from "fs";
import path from "path";

// DELETE broker
const remove = async (request, context) => {
  try {
    const brokerId = await context.params; // FIX
    const id = Number(brokerId.id);

    const broker = await prisma.broker.findUnique({ where: { id } });
    if (!broker) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Delete pic from filesystem if exists
    if (broker.pic) {
      try {
        await saveFile(null, existing.image, "broker", true);
      } catch (err) {
        console.warn("Error deleting image:", err.message);
      }
    }

    await prisma.broker.delete({ where: { id } });

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete broker" },
      { status: 500 }
    );
  }
};

export const DELETE = withAuth(remove, ACCESS_CONTROL.broker.delete);
