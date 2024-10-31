import { NextRequest, NextResponse } from "next/server";
import { read, utils } from "xlsx";
import prisma from "@/lib/database/db";
import {
  ExcelFileSchema,
  ExcelTeacherSchema,
} from "@/validation/importExcelSchema.validation";

export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read the workbook from the ArrayBuffer
    const buffer = await file.arrayBuffer();
    const workbook = read(buffer, { type: "array" });

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json<Record<string, any>>(worksheet);

    // Clean and validate data in a single pass
    const validTeachers = data
      .map((teacher) => {
        // Clean NIP by removing invalid characters and trim
        const rawNip =
          teacher.NIP?.toString()
            .replace(/\u200C/g, "")
            .trim() ?? "";
        const nip =
          rawNip && rawNip.toLowerCase() !== "null" && /^\d+$/.test(rawNip)
            ? rawNip
            : null;

        if (!nip) return null;

        const validate = ExcelTeacherSchema.safeParse(teacher);
        if (!validate.success) return null;

        const validatedTeacher = validate.data;

        return {
          nama: validatedTeacher["Nama Lengkap"],
          nip,
          no_hp: "Kosong", // Placeholder for phone number
          alamat: "Kosong", // Placeholder for address
        };
      })
      .filter(
        (
          teacher
        ): teacher is {
          nama: string;
          nip: string;
          no_hp: string;
          alamat: string;
        } => teacher !== null
      ); // Filter out invalid entries

    if (validTeachers.length === 0) {
      return NextResponse.json(
        { message: "No valid teachers to import" },
        { status: 400 }
      );
    }

    // Check which NIPs are already in the database
    const existingNips = new Set(
      (
        await prisma.dataGuru.findMany({
          where: { nip: { in: validTeachers.map((teacher) => teacher?.nip) } },
          select: { nip: true },
        })
      ).map((record) => record.nip)
    );

    // Filter out teachers whose NIP already exists
    const newTeachers = validTeachers.filter(
      (teacher) => !existingNips.has(teacher?.nip)
    );

    if (newTeachers.length > 0) {
      // Batch insert new valid teachers
      await prisma.dataGuru.createMany({ data: newTeachers });
      return NextResponse.json({ message: "Teachers imported successfully" });
    }

    return NextResponse.json(
      { message: "No valid teachers to import" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
