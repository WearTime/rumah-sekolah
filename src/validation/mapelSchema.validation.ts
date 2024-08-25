import { z } from "zod";

const tipe_mapel = ["Umum", "Jurusan"];

const mapelSchema = z.object({
  kode_mapel: z
    .string()
    .min(1, "Kode harus diisi")
    .max(100, "Kode Tidak boleh lebih dari 100 Karakter"),
  nama_mapel: z
    .string()
    .min(1, "Nama harus diisi")
    .max(30, "Nama Tidak boleh lebih dari 30 Karakter"),
  fase: z
    .string()
    .min(1, "Fase Mapel harus diisi")
    .max(30, "Nase Mapel Tidak boleh lebih dari 30 Karakter"),
  tipe_mapel: z
    .string()
    .min(1, "Tipe Mapel harus diisi")
    .refine((value) => tipe_mapel.includes(value), {
      message: "Hanya bisa memilih Umum atau Jurusan",
    }),
});

export default mapelSchema;
