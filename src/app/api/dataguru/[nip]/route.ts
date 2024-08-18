import prisma from "@/lib/database/db";
import { encrypt } from "@/utils/imageEncrypt";
import { verifyToken } from "@/utils/verifyToken";
import guruSchema from "@/validation/guruSchema.validation";
import { createWriteStream, existsSync, promises, unlinkSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from "path";
import { Readable } from "stream";

async function deleteOldFile(imageUrl: string) {
  if (imageUrl) {
    const oldFilePath = join(
      process.cwd(),
      "uploads",
      "guru",
      imageUrl.split("?file=")[1]
    );
    if (existsSync(oldFilePath)) {
      unlinkSync(oldFilePath);
    }
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    return await verifyToken(req, true, async () => {
      const nip = params.nip;

      const checkData = await prisma.dataGuru.findMany({
        where: {
          nip,
        },
      });

      if (checkData.length < 1) {
        return NextResponse.json(
          { message: "Data siswa dengan nisn tersebut tidak ditemukan" },
          { status: 400 }
        );
      }

      const guru = checkData[0];

      if (guru.image) {
        await deleteOldFile(guru.image);
      }

      const deleteData = await prisma.dataGuru.deleteMany({
        where: {
          nip,
        },
      });
      return NextResponse.json({ data: deleteData }, { status: 200 });
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: any) {
  try {
    return await verifyToken(req, true, async () => {
      const nip = params.nip;
      const formData = await req.formData();

      const bodyString = formData.get("data") as string;
      const file = formData.get("image") as File | null;

      if (!bodyString) {
        return NextResponse.json(
          { message: "Data is missing from the formData" },
          { status: 400 }
        );
      }

      const body = JSON.parse(bodyString);
      const check = guruSchema.safeParse(body);

      if (!check.success) {
        return NextResponse.json(
          { data: null, message: check.error.errors[0].message },
          { status: 400 }
        );
      }
      const existingData = await prisma.dataGuru.findUnique({
        where: { nip },
      });

      if (!existingData) {
        return NextResponse.json(
          { message: "Data guru tidak ditemukan" },
          { status: 404 }
        );
      }

      body.image = existingData.image || "";

      if (file) {
        const extension = extname(file.name);
        const encryptedFileName = encrypt(file.name) + extension;

        const uploadDir = join(process.cwd(), "uploads", "guru");

        if (!existsSync(uploadDir)) {
          await promises.mkdir(uploadDir, { recursive: true });
        }

        const filePath = join(uploadDir, encryptedFileName);

        const writeStream = createWriteStream(filePath);
        const readableStream = Readable.fromWeb(file.stream() as any);
        readableStream.pipe(writeStream);

        await new Promise((resolve) => writeStream.on("finish", resolve));

        body.image = `/api/getProfileImage/guru?file=${encodeURIComponent(
          encryptedFileName
        )}`;

        // Hapus file gambar lama
        await deleteOldFile(`${existingData.image}`);
      }

      const updatedData = await prisma.dataGuru.update({
        where: { nip },
        data: body,
      });

      return NextResponse.json({ data: updatedData }, { status: 200 });
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
