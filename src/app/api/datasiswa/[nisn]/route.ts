import prisma from "@/lib/database/db";
import { encrypt } from "@/utils/uploadImage";
import { verifyToken } from "@/utils/verifyToken";
import siswaSchema from "@/validation/siswaSchema.validation";
import { createWriteStream } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
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
      const body = JSON.parse(formData.get("data") as string); // Assuming the data is sent as JSON string

      // Validate data
      const parsedData = siswaSchema.safeParse(body);

      if (!parsedData.success) {
        return NextResponse.json(
          { data: null, message: parsedData.error.format() },
          { status: 400 }
        );
      }

      // Check if student exists
      const checkData = await prisma.dataSiswa.findUnique({
        where: {
          nisn: nisn,
        },
      });

      if (!checkData) {
        return NextResponse.json(
          { message: "Data siswa dengan nisn tersebut tidak ditemukan" },
          { status: 400 }
        );
      }

      // Handling file upload
      const file = formData.get("image") as File | null;
      let profileImageUrl = null;

      if (file && file.size < 1048576) {
        const filePath = join(process.cwd(), "uploads", file.name);

        // Convert ReadableStream to Node.js Readable stream
        const readableStream = Readable.fromWeb(file.stream() as any);

        const writeStream = createWriteStream(filePath);
        readableStream.pipe(writeStream);

        await new Promise((resolve) => writeStream.on("finish", resolve));

        const encryptedFileName = encrypt(file.name);
        profileImageUrl = `/api/getProfileImage?file=${encodeURIComponent(
          encryptedFileName
        )}`;

        parsedData.data.image = profileImageUrl;
      } else {
        // If no new image, retain the existing one
        delete parsedData.data.image;
      }

      const updateData = {
        ...parsedData.data,
        image: profileImageUrl || parsedData.data.image || checkData.image, // retain existing image if no new one is uploaded
      };
      // Update the student's data
      const updateSiswa = await prisma.dataSiswa.update({
        where: {
          nisn: nisn,
        },
        data: updateData,
      });

      return NextResponse.json({ data: updateSiswa }, { status: 200 });
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
