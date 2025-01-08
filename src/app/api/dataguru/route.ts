import prisma from "../../../lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { createWriteStream, existsSync, promises } from "fs";
import { extname, join } from "path";
import { encrypt } from "@/utils/imageEncrypt";
import { Readable } from "stream";
import {
  guruMapelSchema,
  guruSchema,
} from "@/validation/guruSchema.validation";
import getPagination from "@/lib/pagination";

export async function GET(req: NextRequest) {
  try {
    return await verifyToken(req, false, async () => {
      const { searchParams } = new URL(req.url);
      const { search, skip, take } = getPagination(searchParams);

      const [allData, total] = await prisma.$transaction([
        prisma.dataGuru.findMany({
          include: {
            guruandmapel: {
              include: {
                mapel: true,
              },
            },
          },
          where: {
            nama: {
              contains: search,
            },
          },
          skip: skip,
          take: 12,
        }),
        prisma.dataGuru.count({
          where: {
            nama: {
              contains: search,
            },
          },
        }),
      ]);
      return NextResponse.json({ data: allData, total }, { status: 200 });
    });
  } catch (error) {
    console.log(error);
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
      const file = formData.get("image") as File | null;
      const kode_mapel = JSON.parse(formData.get("kode_mapel") as string);

      const guruIsExist = await prisma.dataGuru.findUnique({
        where: {
          nip: body.nip,
        },
      });

      if (guruIsExist) {
        return NextResponse.json(
          { data: null, message: "Data Guru already exist" },
          { status: 409 }
        );
      }

      const check = guruSchema.safeParse(body);
      const mapelCheck = guruMapelSchema.safeParse(kode_mapel);
      if (!check.success) {
        return NextResponse.json(
          { data: null, message: check.error.errors[0].message },
          { status: 400 }
        );
      }

      if (!mapelCheck.success) {
        return NextResponse.json(
          { data: null, message: mapelCheck.error.errors[0].message },
          { status: 400 }
        );
      }

      if (file) {
        const extension = extname(file.name);
        const encryptedFileName = encrypt(file.name) + extension;

        const uploadDir = join(process.cwd(), "uploads", "guru");

        if (!existsSync(uploadDir)) {
          await promises.mkdir(uploadDir, { recursive: true });
        }

        const filePath = join(uploadDir, encryptedFileName);

        const writeStream = createWriteStream(filePath);
        const readableStream = Readable.fromWeb(file.stream() as any);
        readableStream.pipe(writeStream);

        await new Promise((resolve, reject) => {
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        });

        body.image = `/api/getProfileImage/guru?file=${encodeURIComponent(
          encryptedFileName
        )}`;
      }

      // Simpan data ke database
      const result = await prisma.dataGuru.create({
        data: body,
      });

      await prisma.guruAndMapel.create({
        data: {
          mapel: {
            connect: {
              kode_mapel: kode_mapel.mapel,
            },
          },
          guru: {
            connect: {
              nip: body.nip,
            },
          },
        },
      });

      return NextResponse.json({ data: result }, { status: 201 });
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
