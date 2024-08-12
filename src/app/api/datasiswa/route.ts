import { verify } from "jsonwebtoken";
import prisma from "../../../lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import siswaSchema from "@/validation/siswaSchema.validation";
import { verifyToken } from "@/utils/verifyToken";

export async function GET(req: NextRequest) {
  try {
    return await verifyToken(req, false, async () => {
      const allData = await prisma.dataSiswa.findMany();
      const count = allData.length;
      return NextResponse.json(
        { data: allData, total: count },
        { status: 200 }
      );
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return await verifyToken(req, true, async () => {
      const body = await req.json();
      const parsedData = siswaSchema.safeParse(body);

      if (!parsedData.success) {
        return NextResponse.json(
          { data: null, message: parsedData.error.format() },
          { status: 400 }
        );
      }

      const checkData = await prisma.dataSiswa.findMany({
        where: {
          nisn: parsedData.data.nisn,
          nis: parsedData.data.nis,
        },
      });

      if (checkData.length > 0) {
        return NextResponse.json(
          { message: "NISN Atau NIS sudah ada." },
          { status: 400 }
        );
      }

      const newSiswa = await prisma.dataSiswa.create({
        data: parsedData.data,
      });

      return NextResponse.json(
        { data: newSiswa, message: "Successfully add siswa data" },
        { status: 201 }
      );
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    return await verifyToken(req, true, async () => {
      const { searchParams } = new URL(req.url);
      console.log(searchParams);
    });
  } catch (error) {}
}
