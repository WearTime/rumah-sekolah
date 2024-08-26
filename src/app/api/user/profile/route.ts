import prisma from "@/lib/database/db";
import { encrypt } from "@/utils/imageEncrypt";
import { verifyToken } from "@/utils/verifyToken";
import { userNameSchema } from "@/validation/userSchema.validation";
import { compare, hash } from "bcrypt";
import { existsSync, createWriteStream, promises, unlinkSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from "path";
import { Readable } from "stream";

async function deleteOldFile(imageUrl: string) {
  if (imageUrl) {
    console.log("tesst");
    const oldFilePath = join(
      process.cwd(),
      "uploads",
      "users",
      imageUrl.split("?file=")[1]
    );
    if (existsSync(oldFilePath)) {
      unlinkSync(oldFilePath);
    }
  }
}
export async function GET(req: NextRequest) {
  try {
    return await verifyToken(req, false, async (decoded: { id: string }) => {
      const getUser = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!getUser) {
        return NextResponse.json(
          { user: null, message: "User not found" },
          { status: 404 }
        );
      }

      const { password, ...rest } = getUser;
      return NextResponse.json({ user: rest }, { status: 200 });
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { user: null, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    return await verifyToken(req, false, async (decoded: { id: string }) => {
      const getUser = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      const data = {
        profile: getUser?.profile,
      };
      const formData = await req.formData();
      const body = JSON.parse(formData.get("data") as string) || data;
      const file = formData.get("image") as File | null;

      if (body.username) {
        const usernameIsExist = await prisma.user.findUnique({
          where: { username: body.username },
        });
        if (usernameIsExist?.username !== getUser?.username) {
          return NextResponse.json(
            {
              data: null,
              message: `Username ${body.username} has been used by other users`,
            },
            { status: 409 }
          );
        }

        const check = userNameSchema.safeParse(body);

        if (!check.success) {
          return NextResponse.json(
            { data: null, message: check.error.errors[0].message },
            { status: 400 }
          );
        }
      }

      if (body.old_password) {
        const passwordConfirm = await compare(
          body.old_password,
          `${getUser?.password}`
        );

        if (!passwordConfirm) {
          return NextResponse.json(
            { user: null, message: "Old password is incorrect" },
            { status: 401 }
          );
        }

        const passwordSame = await compare(
          body.new_password,
          `${getUser?.password}`
        );

        if (passwordSame) {
          return NextResponse.json(
            {
              user: null,
              message:
                "The new password cannot be the same as the old password",
            },
            { status: 400 }
          );
        }
        delete body.old_password;

        body.password = await hash(body.new_password, 10);
        delete body.new_password;
      }
      body.profile = getUser?.profile || "";

      if (file) {
        const newName = "profile-" + Date.now() + extname(file.name);

        const extension = extname(newName);
        const encryptedFileName = encrypt(newName) + extension;

        const uploadDir = join(process.cwd(), "uploads", "users");

        if (!existsSync(uploadDir)) {
          await promises.mkdir(uploadDir, { recursive: true });
        }

        const filePath = join(uploadDir, encryptedFileName);

        const writeStream = createWriteStream(filePath);
        const readableStream = Readable.fromWeb(file.stream() as any);
        readableStream.pipe(writeStream);

        await new Promise((resolve) => writeStream.on("finish", resolve));

        body.profile = `/api/getProfileImage/users?file=${encodeURIComponent(
          encryptedFileName
        )}`;

        // Hapus file gambar lama
        if (getUser?.profile) {
          await deleteOldFile(`${getUser?.profile}`);
        }
      }
      const user = await prisma.user.update({
        where: { id: decoded.id },
        data: body,
      });

      const { password, ...rest } = user;
      return NextResponse.json(
        { user: rest, message: "User Updated Successfully" },
        { status: 200 }
      );
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { user: null, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
