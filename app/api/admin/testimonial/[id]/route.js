import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { withAuth } from "../../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../../src/lib/accessControl";
import { saveFile } from "../../../../../src/lib/uploadFile";

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
// PUT update testimonial
const update = async (request, context) => {
  try {
    const testimonialId = await context.params; // FIX
    const id = Number(testimonialId.id);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid testimonial id" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const profession = formData.get("profession");
    const message = formData.get("message");
    const file = formData.get("image");

    const existing = await prisma.testimonial.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const imagePath = await saveFile(file, existing.image, "city");

    // Handle optional new pic

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: name.trim(),
        profession: profession?.trim() || existing.profession,
        message: message?.trim() || existing.message,
        image: imagePath,
      },
    });

    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update testimonial" },
      { status: 500 }
    );
  }
};

// DELETE testimonial
const remove = async (request, context) => {
  try {
    const testimonialId = await context.params; // FIX
    const id = Number(testimonialId.id);

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Delete pic from filesystem if exists
    if (testimonial.pic) {
      try {
        await saveFile(null, existing.image, "testimonial", true);
      } catch (err) {
        console.warn("Error deleting image:", err.message);
      }
    }

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
};
//
export const GET = withAuth(getSingle, ACCESS_CONTROL.testimonial.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.testimonial.update);

export const DELETE = withAuth(remove, ACCESS_CONTROL.testimonial.delete);
