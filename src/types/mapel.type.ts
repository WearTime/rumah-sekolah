import { GuruAndMapel } from "./guruandmapel.types";

export type Mapel = {
  kode_mapel: string;
  nama_mapel: string;
  fase: string;
  tipe_mapel: string;
  jurusan: string;
  guruandmapel?: GuruAndMapel[];
};
