import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";

const getSingle = async (request, context) => {
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

// update  contacts

const update = async (request, context) => {
  try {
    const id = parseInt(params.id);
    const payload = await request.json();

    const updatedContact = await prisma.contactUs.update({
      where: { id },
      data: { active: payload.active },
    });

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update contact" },
      { status: 500 }
    );
  }
};

// DELETE contact
const remove = async (request, context) => {
  try {
    const id = parseInt(params.id);
    await prisma.contactUs.delete({ where: { id } });
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete contact" },
      { status: 500 }
    );
  }
};
//
export const GET = withAuth(getSingle, ACCESS_CONTROL.contact.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.contact.update);

export const DELETE = withAuth(remove, ACCESS_CONTROL.contact.delete);
