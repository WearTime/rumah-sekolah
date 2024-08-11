"use client";
import ListSiswaView from "@/components/views/Dashboard/Siswa/ListSiswa"; // Pastikan path ini benar
import dataSiswaServices from "@/services/dataSiswa";
import { Siswa } from "@/types/siswa.type";
import { useEffect, useState } from "react";

type SiswaDataResponse = {
  data: Siswa[];
  total: number;
};

const ListSiswaPage = () => {
  const [siswaDataResponse, setSiswaDataResponse] =
    useState<SiswaDataResponse | null>(null);

  useEffect(() => {
    const getSiswaData = async () => {
      const { data } = await dataSiswaServices.getAllSiswa();
      setSiswaDataResponse(data);
    };

    getSiswaData();
  }, []);

  return (
    <div>
      {siswaDataResponse && (
        <ListSiswaView siswaData={siswaDataResponse.data} />
      )}
    </div>
  );
};

export default ListSiswaPage;
