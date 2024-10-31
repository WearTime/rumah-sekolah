import { z } from "zod";

const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];

const siswaSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama harus diisi")
    .max(100, "Nama Tidak boleh lebih dari 100 Karakter"),
  nisn: z
    .string()
    .min(1, "NISN harus diisi")
    .max(11, "NISN Tidak boleh lebih dari 10 Karakter"),
  nis: z
    .string()
    .min(1, "NIS harus diisi")
    .max(10, "Nis Tidak boleh lebih dari 10 Karakter"),
  kelas: z.enum(["X", "XI", "XII"], {
    errorMap: () => ({
      message: "Kelas harus salah satu dari 'X', 'XI', atau 'XII'",
    }),
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
  jk: z
    .enum(["L", "P"], {
      errorMap: () => ({ message: "Jenis kelamin harus 'L' atau 'P'" }),
    })
    .optional(),
  tempat_lahir: z.string().max(100).optional(),
  tanggal_lahir: z.string().optional(), // atau gunakan z.date() jika menggunakan tipe Date
  agama: z.string().max(50).optional(),
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
