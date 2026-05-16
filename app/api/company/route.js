import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { saveFile } from "../../../src/lib/uploadFile";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

// POST create company
const create = async (request) => {
  try {
    const formData = await request.formData();

    // Save uploaded pic to public/pic/testimonial
    const companyPicFile = formData.get("pic"); // may be undefined
    const pic = await saveFile(companyPicFile, "company");

    const company = await prisma.company.create({
      data: {
        name: formData.get("name")?.trim(),
        location: formData.get("location")?.trim(),
        about: formData.get("about")?.trim(),
        website: formData.get("website")?.trim(),
        logo: pic,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create company" },
      { status: 500 }
    );
  }
};

export const POST = withAuth(create, ACCESS_CONTROL.company.create);
