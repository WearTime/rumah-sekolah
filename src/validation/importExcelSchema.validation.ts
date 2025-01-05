import { z } from "zod";

export const ExcelStudentSchema = z.object({
  NISN: z.string().min(5, "NISN must be at least 5 characters long"),
  Nama: z.string().min(1, "Name is required"),
  // Tingkat: z
  //   .string()
  //   .refine(
  //     (val) =>
  //       ["10", "11", "12", "Kelas 10", "Kelas 11", "Kelas 12"].includes(val),
  //     "Invalid class level"
  //   ),
  "Rombel Saat Ini": z.string().min(1, "Rombel is required"),
  "Tanggal Lahir": z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  HP: z.string(),
  Alamat: z.string(),
  JK: z.string(),
  "Tempat Lahir": z.string(),
});

export const ExcelTeacherSchema = z.object({
  NIP: z.string().min(1, "NIP Must be at least 1 characters long"),
  "Nama Lengkap": z.string().min(1, "Name is required"),
  "Jabatan PTK": z
    .string()
    .min(1, "Jabatan PTK Must be at least 1 characters long"),
});
// Define the Zod schema for file validation
export const ExcelFileSchema = z.custom<File>(
  (file) => {
    const validExtensions = ["xlsx", "xls"];
    const fileExtension = file.name.split(".").pop();
    return validExtensions.includes(fileExtension || "");
  },
  {
    message: "Invalid file type. Please upload an Excel file (.xlsx or .xls)",
  }
);
