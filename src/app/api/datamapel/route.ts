import prisma from "../../../lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { createWriteStream, existsSync, promises } from "fs";
import { extname, join } from "path";
import { encrypt } from "@/utils/imageEncrypt";
import { Readable } from "stream";
import mapelSchema from "@/validation/mapelSchema.validation";

export async function GET(req: NextRequest) {
  try {
    return await verifyToken(req, false, async () => {
      const { searchParams } = new URL(req.url);
      const search = searchParams.get("search") || "";
      const page = parseInt(searchParams.get("page") || "1", 10);
      const pageSize = 10; // Jumlah data per halaman
      const skip = (page - 1) * pageSize;

      const [allData, total] = await prisma.$transaction([
        prisma.mapel.findMany({
          where: {
            nama_mapel: {
              contains: search,
            },
          },
          skip: skip,
          take: pageSize,
        }),
        prisma.mapel.count({
          where: {
            nama_mapel: {
              contains: search,
            },
          },
        }),
      ]);

      return NextResponse.json({ data: allData, total }, { status: 200 });
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
      const formData = await req.formData();
      const body = JSON.parse(formData.get("data") as string);

      const check = mapelSchema.safeParse(body);

      if (!check.success) {
        return NextResponse.json(
          { data: null, message: check.error.errors[0].message },
          { status: 400 }
        );
      }
      // Simpan data ke database
      const result = await prisma.mapel.create({
        data: body,
      });

      return NextResponse.json({ data: result }, { status: 201 });
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
