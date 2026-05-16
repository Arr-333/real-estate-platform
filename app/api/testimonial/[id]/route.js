import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
// import fs from "fs";
// import path from "path";
// import { saveFile } from "../../../../src/lib/uploadFile";

const getSingle = async (request, context) => {
  const testimonialId = await context.params; // FIX
  const id = Number(testimonialId.id);

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getSingle, ACCESS_CONTROL.testimonial.getSingle);
