import instance from "../../lib/axios/instance";

const endpoint = "/api/datamapel";

const dataMapelServices = {
  getAllMapel: ({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) => instance.get(`${endpoint}?page=${page}&search=${search}`),
  getMapelByJurusan: (jurusan: string) =>
    instance.get(`${endpoint}/${jurusan}`),
  addNewMapel: (formData: FormData) =>
    instance.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteDataMapel: (kode_mapel: string) =>
    instance.delete(`${endpoint}/${kode_mapel}`),
  editDataMapel: (kode_mapel: string, formData: FormData) =>
    instance.put(`${endpoint}/${kode_mapel}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  searchDataMapel: (search: string) =>
    instance.get(`${endpoint}?search=${search}`),
};

export default dataMapelServices;
