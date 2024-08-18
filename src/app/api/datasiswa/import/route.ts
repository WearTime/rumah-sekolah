import { NextRequest, NextResponse } from "next/server";
import { read, readFile, utils } from "xlsx";
import prisma from "@/lib/database/db";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Convert file to ArrayBuffer for reading
  const buffer = await file.arrayBuffer();

  // Read the workbook directly from the ArrayBuffer
  const workbook = read(buffer, { type: "array" });

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = utils.sheet_to_json(worksheet);

  const formattedData = (data as Record<string, any>[]).map((student) => {
    const kelasRoman = convertToRoman(student["Tingkat"]);
    const rombel = extractRombel(student["Rombel"]);
    const jurusan = mapJurusan(rombel);

    return {
      nisn: student["Nisn"],
      nis: null,
      nama: student["Nama Lengkap"],
      kelas: kelasRoman as "X" | "XI" | "XII", // Ensure the values match the enum
      jurusan: jurusan,
      no_hp: null,
      alamat: null,
    };
  });

  await prisma.dataSiswa.createMany({ data: formattedData });

  return NextResponse.json({ message: "Students imported successfully" });
}

function convertToRoman(kelas: string): "X" | "XI" | "XII" | undefined {
  const map: Record<string, "X" | "XI" | "XII"> = {
    "10": "X",
    "11": "XI",
    "12": "XII",
  };
  return map[kelas];
}

function extractRombel(rombel: string): string {
  const parts = rombel.split(" ");
  return parts.slice(1).join(" "); // Extract "AKL 3" from "X AKL 3"
}

function mapJurusan(rombel: string): string {
  const jurusanMap: Record<string, string> = {
    BR: "MPLB",
    KUL: "KULINER",
  };

  const jurusanKey = rombel.split(" ")[0];
  return jurusanMap[jurusanKey] || rombel;
}
