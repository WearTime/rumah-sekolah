import { GuruAndMapel } from "./guruandmapel.types";

export type Guru = {
  guruandmapel?: GuruAndMapel[];
  nip: string;
  nama: string;
  no_hp: string;
  alamat: string;
  image?: File | null;
};
