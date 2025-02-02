import instance from "@/lib/axios/instance";

const endpoint = {
  siswa: "/api/datasiswa",
  import: "/api/datasiswa/import",
};

interface GetSiswaParams {
  page?: number;
  search?: string;
  sortBy?: "nama" | "kelas" | "jurusan" | "jenis_kelamin";
  sortOrder?: "asc" | "desc";
  jenisKelamin?: string | string[];
  kelas?: string;
  jurusan?: string;
}

const dataSiswaServices = {
  getAllSiswa: ({
    page = 1,
    search = "",
    sortBy,
    sortOrder,
    jenisKelamin,
    kelas,
    jurusan,
  }: GetSiswaParams) => {
    const params = new URLSearchParams();

    // Add base params
    params.append("page", page.toString());
    if (search) params.append("search", search);

    // Add sorting params
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    // Add filter params
    if (Array.isArray(jenisKelamin)) {
      jenisKelamin.forEach((jk) => params.append("jenisKelamin", jk)); // Menambahkan setiap jurusan ke params
    } else if (jenisKelamin) {
      params.append("jenisKelamin", jenisKelamin);
    }
    if (kelas) params.append("kelas", kelas);
    if (jurusan) params.append("jurusan", jurusan);

    return instance.get(`${endpoint.siswa}?${params.toString()}`);
  },

  addNewSiswa: (formData: FormData) =>
    instance.post(endpoint.siswa, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteDataSiswa: (nisn: string) =>
    instance.delete(`${endpoint.siswa}/${nisn}`),

  editDataSiswa: (nisn: string, formData: FormData) =>
    instance.put(`${endpoint.siswa}/${nisn}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  searchDataSiswa: (search: string) =>
    instance.get(`${endpoint.siswa}?search=${search}`),

  importFromExcel: (formData: FormData) =>
    instance.post(endpoint.import, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default dataSiswaServices;
