import prisma from "@/lib/database/db";
import { verifyToken } from "@/utils/verifyToken";
import siswaSchema from "@/validation/siswaSchema.validation";
import { NextRequest, NextResponse } from "next/server";

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
      const body = await req.json();

      const parsedData = siswaSchema.safeParse(body.data);

      if (!parsedData.success) {
        return NextResponse.json(
          { data: null, message: parsedData.error.format() },
          { status: 400 }
        );
      }
      const checkData = await prisma.dataSiswa.findMany({
        where: {
          nisn: nisn,
        },
      });

      console.log(body);

      if (checkData.length < 1) {
        return NextResponse.json(
          { message: "Data siswa dengan nisn tersebut tidak ditemukan" },
          { status: 400 }
        );
      }

      const updateSiswa = await prisma.dataSiswa.update({
        where: {
          nisn: nisn,
        },
        data: parsedData.data,
      });

      console.log(updateSiswa);
      return NextResponse.json({ data: updateSiswa }, { status: 200 });
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
