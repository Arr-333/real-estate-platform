import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import fs from "fs";
import path from "path";
import { saveFile } from "../../../../src/lib/uploadFile";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

const getSingle = async (request, context) => {
  const companyId = await context.params; // FIX
  const id = Number(companyId.id);

  try {
    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        { message: "company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch company" },
      { status: 500 }
    );
  }
};
// PUT update company
const update = async (request, context) => {
  try {
    const companyId = await context.params; // FIX
    const id = Number(companyId.id);
    const formData = await request.formData();
    // Get old data
    const company = await prisma.company.findUnique({ where: { id } });

    if (!company) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const newLogoFile = formData.get("logo");
    const logo = await saveFile(newLogoFile, company.logo, "company");

    const updatedcompany = await prisma.company.update({
      where: { id },
      data: {
        name: formData.get("name")?.trim() ?? company.name,
        location: formData.get("location")?.trim() ?? company.location,
        about: formData.get("about")?.trim() ?? company.about,
        website: formData.get("website")?.trim() ?? company.website,
        logo: logo ?? company.logo,
      },
    });

    return NextResponse.json(updatedcompany, { status: 200, update: formData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update company" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getSingle, ACCESS_CONTROL.company.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.company.update);
