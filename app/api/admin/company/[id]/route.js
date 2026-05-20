import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";

// DELETE company
const remove = async (request, context) => {
  try {
    const companyId = await context.params; // FIX
    const id = Number(companyId.id);

    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Delete pic from filesystem if exists
    if (company.pic) {
      try {
        await saveFile(null, existing.image, "company", true);
      } catch (err) {
        console.warn("Error deleting image:", err.message);
      }
    }

    await prisma.company.delete({ where: { id } });
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete company" },
      { status: 500 }
    );
  }
};

export const DELETE = withAuth(remove, ACCESS_CONTROL.company.delete);
