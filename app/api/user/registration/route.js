import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import passwordValidator from "password-validator";
import { prisma } from "../../../../src/lib/prisma";
import { sendVerificationEmail } from "../../../../src/lib/mail";

// Password validation schema
const schema = new passwordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(30)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();
    console.log("Signup request received with role:", role, email, password);
    const normalizedEmail = email?.toLowerCase();

    // 1️⃣ Basic validation
    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Password validation
    if (!schema.validate(password)) {
      return NextResponse.json({ message: "Weak password" }, { status: 400 });
    }

    // 3️⃣ Decide role
    let finalRole = "Customer"; // Default role
    // let finalRole = role.toUpperCase();
    console.log("Requested role:", finalRole);
    if (typeof role === "string" && role.trim()) {
      const requestedRole = role.toUpperCase();

      const roleRecord = await prisma.role.findUnique({
        where: { name: requestedRole },
      });

      if (!roleRecord) {
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
      }

      finalRole = requestedRole;
    }

    // 4️⃣ Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // 5️⃣ Fetch role record
    const roleRecord = await prisma.role.findUnique({
      where: { name: finalRole },
    });

    if (!roleRecord) {
      return NextResponse.json(
        { message: "Role not configured" },
        { status: 500 }
      );
    }

    // 6️⃣ Auto-generate name
    const derivedName = normalizedEmail.split("@")[0].slice(0, 3).toUpperCase();

    // 7️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7.5️⃣ Send verification email
    const token = crypto.randomBytes(32).toString("hex");
    // const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    const tokenExpiry = new Date(Date.now() + 2 * 60 * 1000); //

    // 8️⃣ Create user
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: derivedName,
          email: normalizedEmail,
          password: hashedPassword,
          roleId: roleRecord.id,
          emailVerifyToken: token,
          emailVerifyExp: tokenExpiry,
          image: "",
          isGoogleUser: false,
          isActive: false,
        },
      });

      if (finalRole === "BROKER") {
        await tx.broker.create({
          data: {
            name: derivedName,
            email: normalizedEmail,
            user: {
              connect: { id: user.id },
            },
          },
        });
      } else if (finalRole === "CUSTOMER") {
        await tx.customer.create({
          data: {
            name: derivedName,
            email: normalizedEmail,
            user: {
              connect: { id: user.id },
            },
          },
        });
      } else if (finalRole === "OWNER") {
        await tx.owner.create({
          data: {
            type: "INDIVIDUAL", // 🔥 ALWAYS DEFAULT
            name: derivedName,
            email: normalizedEmail,
            user: {
              connect: { id: user.id },
            },
          },
        });
      }
    });

    await sendVerificationEmail(normalizedEmail, token);

    return NextResponse.json(
      { message: `${finalRole} account created successfully` },
      { status: 201 }
    );
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
//
