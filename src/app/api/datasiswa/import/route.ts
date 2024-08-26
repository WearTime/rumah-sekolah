import { NextRequest, NextResponse } from "next/server";
import { read, utils } from "xlsx";
import prisma from "@/lib/database/db";
import {
  ExcelFileSchema,
  ExcelStudentSchema,
} from "@/validation/importExcelSchema.validation";
import { verifyToken } from "@/utils/verifyToken";

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get("file") as File;

//   const fileValidation = ExcelFileSchema.safeParse(file);
//   if (!fileValidation.success) {
//     return NextResponse.json(
//       { error: fileValidation.error.message },
//       { status: 400 }
//     );
//   }

//   if (!file) {
//     return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//   }

//   // Convert file to ArrayBuffer for reading
//   const buffer = await file.arrayBuffer();

//   // Read the workbook directly from the ArrayBuffer
//   const workbook = read(buffer, { type: "array" });

//   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//   const data = utils.sheet_to_json(worksheet);

//   // Define the type manually if needed or let TypeScript infer it
//   const validStudents: Array<{
//     nisn: string;
//     nis: string;
//     nama: string;
//     kelas: "X" | "XI" | "XII" | undefined;
//     jurusan: string;
//     no_hp: string;
//     alamat: string;
//   }> = [];

//   // Iterate over the data and validate each student entry
//   for (const student of data as Record<string, any>[]) {
//     const validate = ExcelStudentSchema.safeParse(student);
//     if (!validate.success) {
//       console.log("Validation error:", validate.error.flatten());
//       continue; // Skip this entry and do not add it to validStudents
//     }

//     const validatedStudent = validate.data;

//     // Map the student data
//     const kelasRoman = convertToRoman(validatedStudent.Tingkat);
//     const rombel = extractRombel(validatedStudent.Rombel);
//     const jurusan = mapJurusan(rombel);

//     const dataSiswa = {
//       nisn: validatedStudent.NISN,
//       nis: "Kosong", // Placeholder for NIS
//       nama: validatedStudent["Nama Lengkap"],
//       kelas: kelasRoman,
//       jurusan: jurusan,
//       no_hp: "Kosong", // Placeholder for phone number
//       alamat: "Kosong", // Placeholder for address
//     };

//     const userIsExist = await prisma.dataSiswa.findUnique({
//       where: {
//         nisn: dataSiswa.nisn,
//       },
//     });

//     if (userIsExist) {
//       continue;
//     }
//     validStudents.push(dataSiswa);
//   }

//   if (validStudents.length > 0) {
//     await prisma.dataSiswa.createMany({ data: validStudents });
//     return NextResponse.json({ message: "Students imported successfully" });
//   }

//   return NextResponse.json(
//     { message: "No valid students to import" },
//     { status: 400 }
//   );
// }

export async function POST(req: NextRequest) {
  try {
    return await verifyToken(req, true, async () => {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      // Validate the file
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

      // Read the workbook from the ArrayBuffer
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json<Record<string, any>>(worksheet);

      // Clean and validate data in a single pass
      const validStudents = data
        .map((student) => {
          // Clean Nisn by removing invalid characters and trim
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
          const kelasRoman = convertToRoman(validatedStudent.Tingkat);
          const rombel = extractRombel(validatedStudent.Rombel);
          const jurusan = mapJurusan(rombel);
          return {
            nisn: validatedStudent.NISN,
            nis: "Kosong", // Placeholder for NIS
            nama: validatedStudent["Nama Lengkap"],
            kelas: kelasRoman,
            jurusan: jurusan,
            no_hp: "Kosong", // Placeholder for phone number
            alamat: "Kosong", // Placeholder for address
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
            alamat: string;
          } => student !== null
        ); // Filter out invalid entries

      if (validStudents.length === 0) {
        return NextResponse.json(
          { message: "No valid Students to import" },
          { status: 400 }
        );
      }

      // Check which NIPs are already in the database

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

      // Filter out teachers whose NIP already exists
      console.log(existingNisn);

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
function convertToRoman(kelas: string): "X" | "XI" | "XII" | undefined {
  const kelasNumber = kelas.split(" ")[1];

  const map: Record<string, "X" | "XI" | "XII"> = {
    "10": "X",
    "11": "XI",
    "12": "XII",
  };

  return map[kelasNumber];
}

function extractRombel(rombel: string): string {
  const parts = rombel.split(" ");
  const rombelWithoutClass = parts.slice(1).join(" ");

  const formattedRombel = rombelWithoutClass.replace(/(\D)(\d)/, "$1 $2");
  return formattedRombel;
}

function mapJurusan(rombel: string): string {
  const jurusanMap: Record<string, string> = {
    BR: "MPLB",
    KUL: "KULINER",
  };

  const jurusanKey = rombel.split(" ")[0];
  const jurusanNumber = rombel.split(" ")[1];

  const jurusan = `${jurusanMap[jurusanKey] || jurusanKey} ${
    jurusanNumber || ""
  }`;
  return jurusan;
}
