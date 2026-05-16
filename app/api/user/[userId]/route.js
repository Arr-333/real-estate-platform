import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { saveFile } from "../../../../src/lib/uploadFile";
import { prisma } from "../../../../src/lib/prisma";

// ------------------- GET USER BY ID -------------------
export async function GET(req, { params }) {
  const id = await params;
  const userId = parseInt(id.userId, 10);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// ------------------- UPDATE USER -------------------
export async function PUT(req, { params }) {
  try {
    const userId = parseInt(params.userId);

    const formData = await req.formData();

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        broker: true,
        owner: true,
        customer: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // USER COMMON FIELDS
    const name = formData.get("name") || existingUser.name;
    const phone = formData.get("phone") || existingUser.phone;
    const address = formData.get("address") || existingUser.address;
    const city = formData.get("city") || existingUser.city;
    const state = formData.get("state") || existingUser.state;
    const pin = formData.get("pin") || existingUser.pin;

    const imageFile = formData.get("image");
    const image = await saveFile(imageFile, existingUser.image, "user");

    // Update User table
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        address,
        city,
        state,
        pin,
        image,
      },
    });

    // ---------------- ROLE BASED UPDATE ----------------
    const roleName = existingUser.role.name;

    if (roleName === "BROKER") {
      await prisma.broker.upsert({
        where: {
          userId: userId,
        },
        update: {
          location: formData.get("location"),
          phoneOffice: formData.get("phoneOffice"),
          phoneMobile: formData.get("phoneMobile"),
          about: formData.get("about"),
          language: formData.get("language"),
          bio: formData.get("bio"),
        },
        create: {
          userId,
          location: formData.get("location"),
          phoneOffice: formData.get("phoneOffice"),
          phoneMobile: formData.get("phoneMobile"),
          about: formData.get("about"),
          language: formData.get("language"),
          bio: formData.get("bio"),
        },
      });
    }

    if (roleName === "OWNER") {
      await prisma.owner.upsert({
        where: {
          userId: userId,
        },
        update: {
          companyName: formData.get("companyName"),
          companyGST: formData.get("companyGST"),
          companyPAN: formData.get("companyPAN"),
        },
        create: {
          userId,
          type: formData.get("type"),
          companyName: formData.get("companyName"),
          companyGST: formData.get("companyGST"),
          companyPAN: formData.get("companyPAN"),
        },
      });
    }

    if (roleName === "CUSTOMER") {
      await prisma.customer.upsert({
        where: {
          userId: userId,
        },
        update: {},
        create: {
          userId,
        },
      });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
