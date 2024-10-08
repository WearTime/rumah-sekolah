export type User = {
  id?: string;
  username: string;
  password?: string;
  role?: string;
  profile?: File | null;
};
