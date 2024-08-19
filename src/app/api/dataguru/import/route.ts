import { NextRequest, NextResponse } from "next/server";
import { read, utils } from "xlsx";
import prisma from "@/lib/database/db";
import {
  ExcelFileSchema,
  ExcelStudentSchema,
  ExcelTeacherSchema,
} from "@/validation/importExcelSchema.validation";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const fileValidation = ExcelFileSchema.safeParse(file);
  if (!fileValidation.success) {
    return NextResponse.json(
      { error: fileValidation.error.message },
      { status: 400 }
    );
  }

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Convert file to ArrayBuffer for reading
  const buffer = await file.arrayBuffer();

  // Read the workbook directly from the ArrayBuffer
  const workbook = read(buffer, { type: "array" });

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = utils.sheet_to_json(worksheet);

  // Define the type manually if needed or let TypeScript infer it
  const validStudents: Array<{
    nisn: string;
    nis: string;
    nama: string;
    kelas: "X" | "XI" | "XII" | undefined;
    jurusan: string;
    no_hp: string;
    alamat: string;
  }> = [];

  // Iterate over the data and validate each student entry
  for (const teacher of data as Record<string, any>[]) {
    const validate = ExcelTeacherSchema.safeParse(teacher);
    if (!validate.success) {
      console.log("Validation error:", validate.error.flatten());
      continue; // Skip this entry and do not add it to validStudents
    }

    const validatedTeacher = validate.data;

    // Map the student data
    const jabatan = convertJabatan(validatedTeacher["Jabatan PTK"]);
    // const kelasRoman = convertToRoman(validatedTeacher["Jabatan PTK"]);
    // const rombel = extractRombel(validatedStudent.Rombel);
    // const jurusan = mapJurusan(rombel);

    // const dataSiswa = {
    //   nisn: validatedStudent.NISN,
    //   nis: "Kosong", // Placeholder for NIS
    //   nama: validatedStudent["Nama Lengkap"],
    //   kelas: kelasRoman,
    //   jurusan: jurusan,
    //   no_hp: "Kosong", // Placeholder for phone number
    //   alamat: "Kosong", // Placeholder for address
    // };

    // const userIsExist = await prisma.dataSiswa.findUnique({
    //   where: {
    //     nisn: dataSiswa.nisn,
    //   },
    // });

    // if (userIsExist) {
    //   continue;
    // }
    // validStudents.push(dataSiswa);
  }

  if (validStudents.length > 0) {
    await prisma.dataSiswa.createMany({ data: validStudents });
    return NextResponse.json({ message: "Students imported successfully" });
  }

  return NextResponse.json(
    { message: "No valid students to import" },
    { status: 400 }
  );
}

function convertJabatan(jabatan: string) {
  const jabatanType = jabatan.split("Guru")[0];

  console.log(jabatanType);
}
// function convertToRoman(kelas: string): "X" | "XI" | "XII" | undefined {
//   const kelasNumber = kelas.split(" ")[1];

//   const map: Record<string, "X" | "XI" | "XII"> = {
//     "10": "X",
//     "11": "XI",
//     "12": "XII",
//   };

//   return map[kelasNumber];
// }

// function extractRombel(rombel: string): string {
//   const parts = rombel.split(" ");
//   const rombelWithoutClass = parts.slice(1).join(" ");

//   const formattedRombel = rombelWithoutClass.replace(/(\D)(\d)/, "$1 $2");
//   return formattedRombel;
// }

// function mapJurusan(rombel: string): string {
//   const jurusanMap: Record<string, string> = {
//     BR: "MPLB",
//     KUL: "KULINER",
//   };

//   const jurusanKey = rombel.split(" ")[0];
//   const jurusanNumber = rombel.split(" ")[1];

//   const jurusan = `${jurusanMap[jurusanKey] || jurusanKey} ${
//     jurusanNumber || ""
//   }`;
//   return jurusan;
// }
