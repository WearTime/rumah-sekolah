import { z } from "zod";

const tipe_mapel = ["Umum", "Jurusan"] as const;
const jurusan = [
  "AKL",
  "PPLG",
  "TKJT",
  "DKV",
  "MPLB",
  "BDP",
  "KULINER",
  "TABUS",
  "PHT",
  "ULW",
] as const;

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
  tipe_mapel: z.enum(tipe_mapel, {
    errorMap: () => ({ message: "Hanya bisa memilih Umum atau Jurusan" }),
  }),
  jurusan: z.enum(jurusan, {
    errorMap: () => ({
      message: "Jurusan harus salah satu dari daftar yang tersedia",
    }),
  }),
});

export default mapelSchema;
