import { z } from "zod";

const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];

export const guruSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama harus diisi")
    .max(100, "Nama Tidak boleh lebih dari 100 Karakter"),
  nip: z
    .string()
    .min(1, "NIP harus diisi")
    .max(18, "NIP Tidak boleh lebih dari 18 Karakter"),
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

export const guruMapelSchema = z.object({
  mapel: z.string().min(1, "Mapel Harus diisi"),
});
