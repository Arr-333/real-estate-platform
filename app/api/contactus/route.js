import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

// POST create contact
const create = async (request) => {
  try {
    const payload = await request.json();

    const contact = await prisma.contactUs.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        subject: payload.subject,
        message: payload.message,
        active: payload.active || true,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create contact" },
      { status: 500 }
    );
  }
};
//

export const POST = withAuth(create, ACCESS_CONTROL.contact.create);
