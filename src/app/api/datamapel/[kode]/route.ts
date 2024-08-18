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
      const kode_mapel = params.kode;

      const checkData = await prisma.mapel.findMany({
        where: {
          kode_mapel,
        },
      });

      if (checkData.length < 1) {
        return NextResponse.json(
          { message: "Data siswa dengan nisn tersebut tidak ditemukan" },
          { status: 400 }
        );
      }

      const deleteData = await prisma.mapel.deleteMany({
        where: {
          kode_mapel,
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
      const kode_mapel = params.kode;

      const formData = await req.formData();

      const bodyString = formData.get("data") as string;

      if (!bodyString) {
        return NextResponse.json(
          { message: "Data is missing from the formData" },
          { status: 400 }
        );
      }

      const body = JSON.parse(bodyString);

      const existingData = await prisma.mapel.findUnique({
        where: { kode_mapel },
      });

      if (!existingData) {
        return NextResponse.json(
          { message: "Data guru tidak ditemukan" },
          { status: 404 }
        );
      }
      const updatedData = await prisma.mapel.update({
        where: { kode_mapel },
        data: body,
      });

      return NextResponse.json({ data: updatedData }, { status: 200 });
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
