import type { User } from "~/entities/user";

interface UserAPI {
  birthdate: number;
  email: string;
  first_name: string;
  gender: string;
  last_name: string;
  location: {
    city: string;
    postcode: number;
    state: string;
    street: string;
  };
  phone_number: string;
  title: string;
  username: string;
}

export const userAdaptor = (user: UserAPI): User => {
  return {
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    email: user.email,
    phone: user.phone_number,
    location: user.location,
  };
};
