import prisma from "../../../lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { createWriteStream, existsSync, promises } from "fs";
import { extname, join } from "path";
import { encrypt } from "@/utils/imageEncrypt";
import { Readable } from "stream";
import siswaSchema from "@/validation/siswaSchema.validation";
import getPagination from "@/lib/pagination";

export async function GET(req: NextRequest) {
  try {
    return await verifyToken(req, false, async () => {
      const { searchParams } = new URL(req.url);
      const { search, skip, take } = getPagination(searchParams);

      const [allData, total] = await prisma.$transaction([
        prisma.dataSiswa.findMany({
          where: {
            nama: {
              contains: search,
            },
          },
          skip,
          take,
        }),
        prisma.dataSiswa.count({
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

      const userIsExist = await prisma.dataSiswa.findUnique({
        where: {
          nisn: body.nisn,
        },
      });

      if (userIsExist) {
        return NextResponse.json(
          { data: null, message: "Data Siswa already exist" },
          { status: 409 }
        );
      }
      const check = siswaSchema.safeParse(body);

      if (!check.success) {
        return NextResponse.json(
          { data: null, message: check.error.errors[0].message },
          { status: 400 }
        );
      }
      if (file) {
        // Dapatkan ekstensi file asli
        const extension = extname(file.name);
        // Enkripsi nama file dan tambahkan ekstensi
        const encryptedFileName = encrypt(file.name) + extension;

        const uploadDir = join(process.cwd(), "uploads", "siswa");

        // Cek apakah folder "uploads/siswa" ada, jika tidak, buat folder tersebut
        if (!existsSync(uploadDir)) {
          await promises.mkdir(uploadDir, { recursive: true });
        }

        const filePath = join(uploadDir, encryptedFileName);

        // Simpan file ke filesystem
        const writeStream = createWriteStream(filePath);
        const readableStream = Readable.fromWeb(file.stream() as any);
        readableStream.pipe(writeStream);

        // Tunggu hingga penulisan selesai
        await new Promise((resolve, reject) => {
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        });

        // Tambahkan path file ke body
        body.image = `/api/getProfileImage/siswa?file=${encodeURIComponent(
          encryptedFileName
        )}`;
      }
      body.tanggal_lahir = convertToISODate(body.tanggal_lahir);

      // Simpan data ke database
      const result = await prisma.dataSiswa.create({
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

function convertToISODate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date.toISOString();
}
