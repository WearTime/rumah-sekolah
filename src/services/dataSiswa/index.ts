import instance from "../../lib/axios/instance";

const endpoint = "/api/datasiswa";

const dataSiswaServices = {
  getAllSiswa: () => instance.get(endpoint),
};

export default dataSiswaServices;
