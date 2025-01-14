import prisma from "../../../lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import siswaSchema from "@/validation/siswaSchema.validation";
import getPagination from "@/lib/pagination";
import { StructureOrganisasiSchema } from "@/validation/guruSchema.validation";

export async function GET(req: NextRequest) {
  try {
    return await verifyToken(req, false, async () => {
      const { searchParams } = new URL(req.url);
      const { search, skip, take } = getPagination(searchParams);

      const [allData, total] = await prisma.$transaction([
        prisma.structurOrganisasi.findMany({
          include: {
            guru: {
              select: {
                nama: true,
                image: true,
              },
            },
          },
          where: {
            guru: {
              nama: {
                contains: search,
              },
            },
          },
          skip,
          take,
        }),
        prisma.structurOrganisasi.count({
          where: {
            guru: {
              nama: {
                contains: search,
              },
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
    const validation = StructureOrganisasiSchema.safeParse(body);

    if (!validation.success) {
      console.error(validation.error);
      return NextResponse.json(
        { data: null, message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    try {
      const structurOrganisasiExists =
        await prisma.structurOrganisasi.findUnique({
          where: { nip: body.nip },
          select: { nip: true },
        });

      if (structurOrganisasiExists) {
        return NextResponse.json(
          { data: null, message: "Data already exists" },
          { status: 409 }
        );
      }

      const newStructureOrganisasi = await prisma.structurOrganisasi.create({
        data: body,
      });

      return NextResponse.json(
        { data: newStructureOrganisasi },
        { status: 201 }
      );
    } catch (error) {
      console.error("Database Error:", error);
      return NextResponse.json(
        { data: null, message: "Failed to save data" },
        { status: 500 }
      );
    }
  });
}
