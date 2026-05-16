import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

const getSingle = async (req, { params }) => {
  const id = parseInt(params.id);
  try {
    const contacts = await prisma.contactUs.findUnique({
      where: { id: id },
    });

    if (!contacts) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch contact" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getSingle, ACCESS_CONTROL.contact.getSingle);
