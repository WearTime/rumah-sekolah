import { NextRequest, NextResponse } from "next/server";
import { read, utils } from "xlsx";
import prisma from "@/lib/database/db";
import {
  ExcelFileSchema,
  ExcelStudentSchema,
} from "@/validation/importExcelSchema.validation";
import { verifyToken } from "@/utils/verifyToken";

export async function POST(req: NextRequest) {
  try {
    return await verifyToken(req, true, async () => {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      const fileValidation = ExcelFileSchema.safeParse(file);
      if (!fileValidation.success) {
        return NextResponse.json(
          { message: fileValidation.error.message },
          { status: 400 }
        );
      }

      if (!file) {
        return NextResponse.json(
          { message: "No file uploaded" },
          { status: 400 }
        );
      }

      const buffer = await file.arrayBuffer();
      const workbook = read(buffer, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json<Record<string, any>>(worksheet);

      const validStudents = data
        .map((student) => {
          const rawNisn =
            student.NISN?.toString()
              .replace(/\u200C/g, "")
              .trim() ?? "";
          const nisn =
            rawNisn && rawNisn.toLowerCase() !== "null" && /^\d+$/.test(rawNisn)
              ? rawNisn
              : null;

          if (!nisn) return null;
          const validate = ExcelStudentSchema.safeParse(student);
          if (!validate.success) return null;

          const validatedStudent = validate.data;
          const rombel = validatedStudent["Rombel Saat Ini"];
          const kelasRoman = convertToRoman(rombel);
          const jurusan = extractJurusan(rombel);
          return {
            nisn: validatedStudent.NISN,
            nama: validatedStudent["Nama"],
            kelas: kelasRoman,
            jurusan: jurusan,
            jenis_kelamin: validatedStudent["JK"],
            no_hp: validatedStudent["HP"],
            alamat: validatedStudent["Alamat"],
            tanggal_lahir: convertToISODate(validatedStudent["Tanggal Lahir"]),
            tempat_lahir: validatedStudent["Tempat Lahir"],
          };
        })
        .filter(
          (
            student
          ): student is {
            nama: string;
            nisn: string;
            nis: string;
            kelas: "X" | "XI" | "XII";
            jurusan: string;
            no_hp: string;
            jenis_kelamin: "L" | "P";
            alamat: string;
            tanggal_lahir: string;
            tempat_lahir: string;
          } => student !== null
        );

      if (validStudents.length === 0) {
        return NextResponse.json(
          { message: "No valid Students to import" },
          { status: 400 }
        );
      }

      const existingNisn = new Set(
        (
          await prisma.dataSiswa.findMany({
            where: {
              nisn: { in: validStudents.map((student) => student?.nisn) },
            },
            select: { nisn: true },
          })
        ).map((record) => record.nisn)
      );

      const newTeachers = validStudents.filter(
        (student) => !existingNisn.has(student?.nisn)
      );

      if (newTeachers.length > 0) {
        await prisma.dataSiswa.createMany({ data: newTeachers });
        return NextResponse.json({ message: "Teachers imported successfully" });
      }

      return NextResponse.json(
        { message: "No valid teachers to import" },
        { status: 400 }
      );
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
function convertToRoman(rombel: string): "X" | "XI" | "XII" | undefined {
  const parts = rombel.split(" ");
  const kelas = parts[0];

  const map: Record<string, "X" | "XI" | "XII"> = {
    X: "X",
    XI: "XI",
    XII: "XII",
  };

  return map[kelas];
}

function extractJurusan(rombel: string): string {
  const parts = rombel.split(" ");
  const jurusanPart = parts[1] || "";

  const jurusanName = jurusanPart.replace(/[0-9]/g, "").trim();
  const jurusanNumber = jurusanPart.match(/\d+/)?.[0] || "";

  const jurusanMap: Record<string, string> = {
    PPLG: "PPLG",
    RPL: "PPLG",
    TKJT: "TKJ",
    AKL: "AK",
    MPLB: "MPLB",
    BR: "PM",
    KULINER: "KUL",
  };

  return `${jurusanMap[jurusanName] || jurusanName}${
    jurusanNumber ? ` ${jurusanNumber}` : ""
  }`;
}

function convertToISODate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date.toISOString();
}
