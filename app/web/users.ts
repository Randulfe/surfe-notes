import { useQuery } from "@tanstack/react-query";
import { api } from "./webFactory";

const getUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};
