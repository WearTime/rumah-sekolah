import instance from "../../lib/axios/instance";

const endpoint = {
  guru: "/api/dataguru",
  import: "/api/dataguru/import",
};

const dataGuruServices = {
  getAllGuru: ({ page = 1, search = "" }: { page?: number; search?: string }) =>
    instance.get(`${endpoint.guru}?page=${page}&search=${search}`),
  addNewGuru: (formData: FormData) =>
    instance.post(endpoint.guru, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteDataGuru: (nip: string) => instance.delete(`${endpoint.guru}/${nip}`),
  editDataGuru: (nip: string, formData: FormData) =>
    instance.put(`${endpoint.guru}/${nip}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  searchDataGuru: (search: string) =>
    instance.get(`${endpoint.guru}?search=${search}`),
  importFromExcel: (formData: FormData) =>
    instance.post(endpoint.import, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default dataGuruServices;
