import { useQuery } from "@tanstack/react-query";
import { api } from "./webFactory";
import type { User } from "~/entities/user";
import { userAdaptor } from "~/interfaces/adaptors/user";

const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/users");
  return data.map(userAdaptor);
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};
