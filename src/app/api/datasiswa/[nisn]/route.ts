import prisma from "@/lib/database/db";
import { encrypt } from "@/utils/imageEncrypt";
import { verifyToken } from "@/utils/verifyToken";
import siswaSchema from "@/validation/siswaSchema.validation";
import { createWriteStream, existsSync, promises, unlinkSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from "path";
import { Readable } from "stream";

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
      const body = JSON.parse(formData.get("data") as string);
      const file = formData.get("image") as File | null;

      const existingData = await prisma.dataSiswa.findUnique({
        where: { nisn },
      });

      if (!existingData) {
        return NextResponse.json(
          { message: "Data siswa tidak ditemukan" },
          { status: 404 }
        );
      }

      body.image = existingData.image;

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
        if (existingData.image) {
          const oldFilePath = join(
            process.cwd(),
            "uploads",
            "siswa",
            existingData.image.split("?file=")[1]
          );
          if (existsSync(oldFilePath)) {
            unlinkSync(oldFilePath);
          }
        }
      }

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
