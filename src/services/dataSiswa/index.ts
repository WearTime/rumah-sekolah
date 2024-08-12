import instance from "@/lib/axios/instance";
import { Siswa } from "@/types/siswa.type";

const endpoint = "/api/datasiswa";

const dataSiswaServices = {
  getAllSiswa: () => instance.get(endpoint),
  addNewSiswa: (data: Siswa) => instance.post(endpoint, data),
  deleteDataSiswa: (nisn: string) => instance.delete(`${endpoint}/${nisn}`),
};

export default dataSiswaServices;
