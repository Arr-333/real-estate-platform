import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../src/lib/auth";
import { withAuth } from "../../../../src/lib/withAuth";
import { ACCESS_CONTROL } from "../../../../src/lib/accessControl";

const getSingle = async (req, { params }) => {
  const { id } = params;

  const activity = await prisma.clientActivity.findUnique({
    where: { id: Number(id) },
    include: {
      property: true,
      broker: true,
      customer: true,
    },
  });

  return NextResponse.json(activity);
};

const update = async (req, { params }) => {
  const { id } = params;
  const body = await req.json();

  const updated = await prisma.clientActivity.update({
    where: { id: Number(id) },
    data: {
      status: body.status,
    },
  });

  return NextResponse.json(updated);
};

export const GET = withAuth(getSingle, ACCESS_CONTROL.clientactivity.getSingle);

export const PUT = withAuth(update, ACCESS_CONTROL.clientactivity.update);
