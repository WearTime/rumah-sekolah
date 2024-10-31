import prisma from "../../../lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import mapelSchema from "@/validation/mapelSchema.validation";
import getPagination from "@/lib/pagination";

export async function GET(req: NextRequest) {
  return verifyToken(req, false, async () => {
    const { searchParams } = new URL(req.url);
    const { search, skip, take } = getPagination(searchParams);

    try {
      const [data, total] = await prisma.$transaction([
        prisma.mapel.findMany({
          include: {
            guruandmapel: {
              include: { guru: true },
            },
          },
          where: {
            nama_mapel: { contains: search },
          },
          skip,
          take,
        }),
        prisma.mapel.count({
          where: {
            nama_mapel: { contains: search },
          },
        }),
      ]);

      return NextResponse.json({ data, total }, { status: 200 });
    } catch (error) {
      console.error("Database Error:", error);
      return NextResponse.json(
        { data: null, message: "Failed to retrieve data" },
        { status: 500 }
      );
    }
  });
}

export async function POST(req: NextRequest) {
  return verifyToken(req, true, async () => {
    let formData;
    try {
      formData = await req.formData();
    } catch (error) {
      console.error("FormData Error:", error);
      return NextResponse.json(
        { data: null, message: "Invalid form data" },
        { status: 400 }
      );
    }

    const body = JSON.parse(formData.get("data") as string);
    const guru_nip = formData.get("guru_nip") as string;
    const validation = mapelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { data: null, message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    try {
      const mapelExists = await prisma.mapel.findUnique({
        where: { kode_mapel: body.kode_mapel },
        select: { kode_mapel: true },
      });

      if (mapelExists) {
        return NextResponse.json(
          { data: null, message: "Data Mapel already exists" },
          { status: 409 }
        );
      }

      const newMapel = await prisma.mapel.create({
        data: body,
      });

      await prisma.guruAndMapel.create({
        data: {
          mapel: {
            connect: { kode_mapel: newMapel.kode_mapel },
          },
          guru: {
            connect: { nip: guru_nip },
          },
        },
      });

      return NextResponse.json({ data: newMapel }, { status: 201 });
    } catch (error) {
      console.error("Database Error:", error);
      return NextResponse.json(
        { data: null, message: "Failed to save data" },
        { status: 500 }
      );
    }
  });
}
