export interface User {
  id?: string | number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  timezone?: string;
  locale?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}