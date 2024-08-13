import { z } from "zod";

const kelas = ["X", "XI", "XII"];
const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];

const siswaSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama harus diisi")
    .max(100, "Nama Tidak boleh lebih dari 100 Karakter"),
  nisn: z
    .string()
    .min(1, "NISN harus diisi")
    .max(10, "NISN Tidak boleh lebih dari 10 Karakter"),
  nis: z
    .string()
    .min(1, "NIS harus diisi")
    .max(10, "Nis Tidak boleh lebih dari 10 Karakter"),
  kelas: z
    .string()
    .min(1, "Kelas harus diisi")
    .refine((value) => kelas.includes(value), {
      message: "Hanya bisa memilih X, XI, XII",
    }),
  jurusan: z
    .string()
    .min(1, "Jurusan harus diisi")
    .max(10, "Jurusan Tidak boleh lebih dari 10 Karakter"),
  no_hp: z
    .string()
    .min(1, "No HP harus diisi")
    .max(20, "No HP Tidak boleh lebih dari 20 Karakter"),
  alamat: z
    .string()
    .min(1, "Alamat harus diisi")
    .max(150, "Alamat Tidak boleh lebih dari 150 Karakter"),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .refine(
      (file) => {
        if (!file || typeof file === "string") return true;
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        return fileExtension && allowedImageExtensions.includes(fileExtension);
      },
      {
        message:
          "Hanya file dengan ekstensi .jpg, .jpeg, .png, atau .gif yang diperbolehkan.",
      }
    ),
});

export default siswaSchema;
