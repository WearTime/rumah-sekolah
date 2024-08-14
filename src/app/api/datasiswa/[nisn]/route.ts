import prisma from "@/lib/database/db";
import { encrypt } from "@/utils/imageEncrypt";
import { verifyToken } from "@/utils/verifyToken";
import siswaSchema from "@/validation/siswaSchema.validation";
import { createWriteStream, existsSync, promises, unlinkSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from "path";
import { Readable } from "stream";

async function deleteOldFile(imageUrl: string) {
  if (imageUrl) {
    const oldFilePath = join(
      process.cwd(),
      "uploads",
      "siswa",
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
      const nisn = params.nisn;

      const checkData = await prisma.dataSiswa.findMany({
        where: {
          nisn: nisn,
        },
      });

      if (checkData.length < 1) {
        return NextResponse.json(
          { message: "Data siswa dengan nisn tersebut tidak ditemukan" },
          { status: 400 }
        );
      }

      const deleteData = await prisma.dataSiswa.deleteMany({
        where: {
          nisn: nisn,
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
      const nisn = params.nisn;
      const formData = await req.formData();

      // Log formData untuk debugging
      console.log("formData:", formData);

      // Ambil data dari formData
      const bodyString = formData.get("data") as string;
      const file = formData.get("image") as File | null;

      // Log bodyString untuk debugging
      console.log("bodyString:", bodyString);

      // Pastikan bodyString tidak null
      if (!bodyString) {
        return NextResponse.json(
          { message: "Data is missing from the formData" },
          { status: 400 }
        );
      }

      const body = JSON.parse(bodyString);

      // Log body untuk debugging
      console.log("Parsed Body:", body);

      const existingData = await prisma.dataSiswa.findUnique({
        where: { nisn },
      });

      if (!existingData) {
        return NextResponse.json(
          { message: "Data siswa tidak ditemukan" },
          { status: 404 }
        );
      }

      body.image = existingData.image || "";

      if (file) {
        const extension = extname(file.name);
        const encryptedFileName = encrypt(file.name) + extension;

        const uploadDir = join(process.cwd(), "uploads", "siswa");

        if (!existsSync(uploadDir)) {
          await promises.mkdir(uploadDir, { recursive: true });
        }

        const filePath = join(uploadDir, encryptedFileName);

        const writeStream = createWriteStream(filePath);
        const readableStream = Readable.fromWeb(file.stream() as any);
        readableStream.pipe(writeStream);

        await new Promise((resolve) => writeStream.on("finish", resolve));

        body.image = `/api/getProfileImage?file=${encodeURIComponent(
          encryptedFileName
        )}`;

        // Hapus file gambar lama
        await deleteOldFile(`${existingData.image}`);
      }

      console.log("Updated Body:", body);

      const updatedData = await prisma.dataSiswa.update({
        where: { nisn },
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
