export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  location: Location;
}

export interface Location {
  city: string;
  postcode: number;
  state: string;
  street: string;
}
