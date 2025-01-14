import prisma from "@/lib/database/db";
import { encrypt } from "@/utils/imageEncrypt";
import { verifyToken } from "@/utils/verifyToken";
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

      const siswa = checkData[0];

      if (siswa.image) {
        await deleteOldFile(siswa.image);
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

      const existingData = await prisma.dataSiswa.findUnique({
        where: { nisn },
      });

      if (!existingData) {
        return NextResponse.json(
          { message: "Data siswa tidak ditemukan" },
          { status: 404 }
        );
      }

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

      const userIsExist = await prisma.dataSiswa.findUnique({
        where: {
          nisn: body.nisn,
        },
      });

      if (userIsExist?.nisn !== existingData.nisn) {
        return NextResponse.json(
          {
            data: null,
            message: `Nisn ${body.nisn} has been used by other students`,
          },
          { status: 409 }
        );
      }

      body.tanggal_lahir = convertToISODate(body.tanggal_lahir);
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

        body.image = `/api/getProfileImage/siswa?file=${encodeURIComponent(
          encryptedFileName
        )}`;

        // Hapus file gambar lama
        if (existingData.image) {
          await deleteOldFile(`${existingData.image}`);
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

function convertToISODate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date.toISOString();
}
