import instance from "../../lib/axios/instance";

const endpoint = "/api/dataguru";

const dataGuruServices = {
  getAllGuru: () => instance.get(endpoint),
};

export default dataGuruServices;
