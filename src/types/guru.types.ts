import { Mapel } from "./mapel.type";

export type Guru = {
  nip: string;
  nama: string;
  no_hp: string;
  alamat: string;
  mapel_id: string;
  image?: File | null;
  mapel?: Mapel;
};
