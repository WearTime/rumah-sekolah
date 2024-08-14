import instance from "@/lib/axios/instance";
import { Siswa } from "@/types/siswa.type";

const endpoint = {
  siswa: "/api/datasiswa",
  profileImage: "/api/getProfileImage/siswa",
};

const dataSiswaServices = {
  getAllSiswa: () => instance.get(endpoint.siswa),
  addNewSiswa: (formData: FormData) =>
    instance.post(endpoint.siswa, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteDataSiswa: (nisn: string) =>
    instance.delete(`${endpoint.siswa}/${nisn}`),
  editDataSiswa: (nisn: string, formData: FormData) =>
    instance.put(
      `${endpoint.siswa}/${nisn}`,
      { formData },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),
  getProfileSiswa: (image: string) =>
    instance.get(`${endpoint.profileImage}/${image}`),
};

export default dataSiswaServices;
