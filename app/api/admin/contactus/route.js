import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

// ------------------- CONTACT US FORM -------------------
const getAll = async () => {
  try {
    const contacts = await prisma.contactUs.findMany();
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAll, ACCESS_CONTROL.contact.getAll);
