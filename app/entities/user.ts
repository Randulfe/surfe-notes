export interface User {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: Location;
}

export interface Location {
  city: string;
  postcode: number;
  state: string;
  street: string;
}
