import { z } from "zod";

export const ExcelStudentSchema = z.object({
  NISN: z.string().min(5, "NISN must be at least 5 characters long"),
  "Nama Lengkap": z.string().min(1, "Name is required"),
  Tingkat: z
    .string()
    .refine(
      (val) =>
        ["10", "11", "12", "Kelas 10", "Kelas 11", "Kelas 12"].includes(val),
      "Invalid class level"
    ),
  Rombel: z.string().min(1, "Rombel is required"),
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
