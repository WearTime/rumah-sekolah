import instance from "../../lib/axios/instance";

const endpoint = {
  strorg: "/api/datastrorg",
};

const dataStructureOrganisasiServices = {
  getAllStrOrg: ({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) => instance.get(`${endpoint.strorg}?page=${page}&search=${search}`),
  addNewStrOrg: (formData: FormData) =>
    instance.post(endpoint.strorg, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteDataStrOrg: (nip: string) =>
    instance.delete(`${endpoint.strorg}/${nip}`),
  editDataStrOrg: (nip: string, formData: FormData) =>
    instance.put(`${endpoint.strorg}/${nip}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  searchDataStrOrg: (search: string) =>
    instance.get(`${endpoint.strorg}?search=${search}`),
};

export default dataStructureOrganisasiServices;
