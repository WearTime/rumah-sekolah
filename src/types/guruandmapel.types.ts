import { Guru } from "./guru.types";
import { Mapel } from "./mapel.type";

export type GuruAndMapel = {
  kode_mapel: string;
  mapel: Mapel;
  nip_guru: string;
  guru: Guru;
};
