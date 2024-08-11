import instance from "../../lib/axios/instance";

const endpoint = "/api/datamapel";

const dataMapelServices = {
  getAllMapel: () => instance.get(endpoint),
};

export default dataMapelServices;
