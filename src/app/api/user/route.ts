import prisma from "@/lib/db";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import zod from "zod";

const userValidation = zod.object({
  username: zod.string().min(1, "Username is required").max(130),
  password: zod
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = userValidation.parse(body);

    const existingUserByUsername = await prisma.user.findFirst({
      where: { username: username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, message: "User with this username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "Member",
      },
    });

    const { password: newUserPassword, ...rest } = newUser;
    return NextResponse.json(
      { user: rest, message: "User Created Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { user: null, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
