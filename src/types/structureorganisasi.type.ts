import { Guru } from "./guru.types";

export type StructureOrganisasi = {
  guru?: Guru;
  nip: string;
  jabatan: string;
  nama?: string;
};
