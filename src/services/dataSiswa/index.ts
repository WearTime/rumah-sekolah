import instance from "@/lib/axios/instance";

const endpoint = {
  siswa: "/api/datasiswa",
  import: "/api/datasiswa/import",
};

const dataSiswaServices = {
  getAllSiswa: ({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) => instance.get(`${endpoint.siswa}?page=${page}&search=${search}`),
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
    instance.post(endpoint.import, formData),
};

export default dataSiswaServices;
