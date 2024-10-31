import prisma from "../../../lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { createWriteStream, existsSync, promises } from "fs";
import { extname, join } from "path";
import { encrypt } from "@/utils/imageEncrypt";
import { Readable } from "stream";
import guruSchema from "@/validation/guruSchema.validation";

export async function GET(req: NextRequest) {
  try {
    return await verifyToken(req, false, async () => {
      const { searchParams } = new URL(req.url);
      const search = searchParams.get("search") || "";
      const page = parseInt(searchParams.get("page") || "1", 10);
      const pageSize = 12; // Jumlah data per halaman
      const skip = (page - 1) * pageSize;

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
          take: pageSize,
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

      if (!check.success) {
        return NextResponse.json(
          { data: null, message: check.error.errors[0].message },
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
