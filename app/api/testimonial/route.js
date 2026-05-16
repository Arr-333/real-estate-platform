import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";
import { saveFile } from "../../../src/lib/uploadFile";
import { withAuth } from "../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../src/lib/accessControl";

// POST create testimonial
const create = async (request) => {
  try {
    const formData = await request.formData();

    // Save uploaded pic to public/pic/testimonial
    const testimonialPicFile = formData.get("pic"); // may be undefined
    const pic = await saveFile(testimonialPicFile, "testimonial");

    const testimonial = await prisma.testimonial.create({
      data: {
        name: formData.get("name")?.trim(),
        profession: formData.get("profession")?.trim(),
        message: formData.get("message")?.trim(),
        pic: pic, // Use the saved file path
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create testimonial" },
      { status: 500 }
    );
  }
};
//

export const POST = withAuth(create, ACCESS_CONTROL.testimonial.create);
