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
  nipd: z.string().optional(),
  jk: z.enum(["L", "P"], {
    errorMap: () => ({ message: "Jenis kelamin harus 'L' atau 'P'" }),
  }),
  tempat_lahir: z.string().max(100).optional(),
  tanggal_lahir: z.string().optional(), // atau gunakan z.date() jika menggunakan tipe Date
  agama: z.string().max(50).optional(),
  rt: z.string().max(3).optional(),
  rw: z.string().max(3).optional(),
  dusun: z.string().max(100).optional(),
  kelurahan: z.string().max(100).optional(),
  kecamatan: z.string().max(100).optional(),
  kode_pos: z.string().max(10).optional(),
  jenis_tinggal: z.string().max(50).optional(),
  alat_transportasi: z.string().max(50).optional(),
  telepon: z.string().max(20).optional(),
  email: z.string().email().optional(),
  skhun: z.string().optional(),
  penerima_kps: z.boolean().optional(),
  no_kps: z.string().max(20).optional(),
  nama_ayah: z.string().max(100).optional(),
  tahun_lahir_ayah: z.number().optional(),
  jenjang_pendidikan_ayah: z.string().optional(),
  pekerjaan_ayah: z.string().optional(),
  penghasilan_ayah: z.string().optional(),
  nik_ayah: z.string().max(20).optional(),
  nama_ibu: z.string().max(100).optional(),
  tahun_lahir_ibu: z.number().optional(),
  jenjang_pendidikan_ibu: z.string().optional(),
  pekerjaan_ibu: z.string().optional(),
  penghasilan_ibu: z.string().optional(),
  nik_ibu: z.string().max(20).optional(),
  nama_wali: z.string().max(100).optional(),
  tahun_lahir_wali: z.number().optional(),
  jenjang_pendidikan_wali: z.string().optional(),
  pekerjaan_wali: z.string().optional(),
  penghasilan_wali: z.string().optional(),
  nik_wali: z.string().max(20).optional(),
  rombel_saat_ini: z.string().optional(),
  no_peserta_ujian_nasional: z.string().max(20).optional(),
  no_seri_ijazah: z.string().max(20).optional(),
  penerima_kip: z.boolean().optional(),
  nomor_kip: z.string().max(20).optional(),
  nama_di_kip: z.string().max(100).optional(),
  nomor_kks: z.string().max(20).optional(),
  no_registrasi_akta_lahir: z.string().max(20).optional(),
  bank: z.string().max(50).optional(),
  nomor_rekening_bank: z.string().max(20).optional(),
  rekening_atas_nama: z.string().max(100).optional(),
  layak_pip: z.boolean().optional(),
  alasan_layak_pip: z.string().optional(),
  kebutuhan_khusus: z.string().optional(),
  sekolah_asal: z.string().max(100).optional(),
  anak_ke_berapa: z.number().optional(),
  lintang: z.number().optional(),
  bujur: z.number().optional(),
  no_kk: z.string().max(20).optional(),
  berat_badan: z.number().optional(),
  tinggi_badan: z.number().optional(),
  lingkar_kepala: z.number().optional(),
  jumlah_saudara_kandung: z.number().optional(),
  jarak_rumah_ke_sekolah_km: z.number().optional(),
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
