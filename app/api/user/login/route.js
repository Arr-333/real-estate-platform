import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ------------------- LOGIN -------------------
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 🔹 Normalize email
    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { result: "Fail", message: "Invalid Username or Password" },
        { status: 401 }
      );
    }

    // Google login
    if (user.isGoogleUser) {
      return NextResponse.json(
        {
          result: "Fail",
          message:
            "This account uses Google login. Please login with Google Or Creta a NEW ACCOUNT",
        },
        { status: 400 }
      );
    }

    // Password check
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return NextResponse.json(
        { result: "Fail", message: "Invalid Username or Password" },
        { status: 401 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          result: "Fail",
          message: "Please verify your email before logging in.",
        },
        { status: 403 }
      );
    }

    const roleName = user.role.name.toUpperCase();

    const roleKeyMap = {
      ADMIN: process.env.JWT_SALT_KEY_ADMIN,
      CUSTOMER: process.env.JWT_SALT_KEY_CUSTOMER,
      BROKER: process.env.JWT_SALT_KEY_BROKER,
      OWNER: process.env.JWT_SALT_KEY_OWNER,
    };

    const key = roleKeyMap[roleName];

    if (!key) {
      return NextResponse.json(
        { message: "JWT secret not configured properly for role." },
        { status: 500 }
      );
    }

    // Create Token
    const token = jwt.sign({ userId: user.id, role: user.role.name }, key, {
      expiresIn: 1296000, // 15 days
    });

    return NextResponse.json({
      status: 200,
      role: user.role.name,
      result: "Done",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 500, result: "Fail", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
