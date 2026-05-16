import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// ------------------- STEP 1: SEND OTP (PUT) -------------------
export async function PUT(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { result: "Fail", message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { status: 404, result: "Fail", message: "User not found" },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiresAt },
    });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Hello ${user.name},\nYour OTP is: ${otp}\nDo not share this with anyone.\n This OTP will expire in 5 minutes.\n- Team E-Krt`,
    });

    return NextResponse.json({
      status: 200,
      result: "Done",
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 500, result: "Fail", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ------------------- STEP 2: VERIFY OTP (PATCH) -------------------
export async function PATCH(req) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { status: 404, result: "Fail", message: "User not found" },
        { status: 404 }
      );
    }

    if (user.otp !== parseInt(otp)) {
      return NextResponse.json(
        { status: 401, result: "Fail", message: "Invalid OTP" },
        { status: 401 }
      );
    }


    //  OTP expired
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return NextResponse.json(
        { result: "Fail", message: "OTP expired" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      status: 200,
      result: "Done",
      message: "OTP Verified",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 500, result: "Fail", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ------------------- STEP 3: RESET PASSWORD (POST) -------------------
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { result: "Fail", message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },

    });

    if (!user) {
      return NextResponse.json(
        { status: 404, result: "Fail", message: "User not found" },
        { status: 404 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashed, otp: null, otpExpiresAt: null, },
    });

    return NextResponse.json({
      status: 200,
      result: "Done",
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 500, result: "Fail", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
//