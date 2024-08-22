import instance from "@/lib/axios/instance";

const endpoint = {
  user: "/api/user",
  profile: "/api/user/profile",
};
const userServices = {
  getAllUsers: () => instance.get(endpoint.user),
  updateUser: (id: string, data: any) =>
    instance.put(`${endpoint.user}/${id}`, { data }),
  deleteUser: (id: string) => instance.delete(`${endpoint.user}/${id}`),
  getProfile: () => instance.get(`${endpoint.profile}`),
  updateProfile: (formData: FormData) =>
    instance.put(`${endpoint.profile}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default userServices;
