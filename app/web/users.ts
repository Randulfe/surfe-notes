import { useQuery } from "@tanstack/react-query";
import { api } from "./webFactory";
import type { User } from "~/entities/user";

const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/users");
  return data;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};
