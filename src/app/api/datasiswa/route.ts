import { verify } from "jsonwebtoken";
import prisma from "../../../lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import siswaSchema from "@/validation/siswaSchema.validation";
import { verifyToken } from "@/utils/verifyToken";
import { createWriteStream, existsSync, promises } from "fs";
import { extname, join } from "path";
import { encrypt } from "@/utils/imageEncrypt";
import { Readable } from "stream";

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
      const formData = await req.formData();
      const body = JSON.parse(formData.get("data") as string);
      const file = formData.get("image") as File | null;
      console.log(body);
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
        body.image = `/api/getProfileImage?file=${encodeURIComponent(
          encryptedFileName
        )}`;
      }

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
