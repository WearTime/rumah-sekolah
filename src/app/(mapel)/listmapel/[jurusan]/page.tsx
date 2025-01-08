"use client";
import ListMapelView from "@/components/views/DesktopMode/Mapel/ListMapel";
import dataMapelServices from "@/services/dataMapel";
import { Mapel } from "@/types/mapel.type";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { notFound } from "next/navigation";

const allowedJurusan = [
  "AKL",
  "PPLG",
  "TJKT",
  "DKV",
  "MPLB",
  "BDP",
  "KULINER",
  "TATABUSANA",
  "PHT",
  "ULW",
];

const ListJurusanMapelPage = ({ params }: { params: { jurusan: string } }) => {
  const [mapelDataResponse, setMapelDataResponse] = useState<{
    data: Mapel[];
    total: number;
  } | null>(null);

  useEffect(() => {
    const getSiswaData = async () => {
      // Convert jurusan parameter to lowercase and validate against allowed jurusan
      const jurusanParam = params.jurusan.toLowerCase();
      const isValidJurusan = allowedJurusan.some(
        (jurusan) => jurusan.toLowerCase() === jurusanParam
      );

      if (!isValidJurusan) {
        notFound();
        return;
      }

      try {
        const { data } = await dataMapelServices.getAllMapel({
          page: 1,
          search: "",
        });

        // Filter the mapel data based on the jurusan parameter
        const filteredData = data.data.filter(
          (mapel: { jurusan: string }) =>
            mapel.jurusan.toLowerCase() === jurusanParam
        );

        setMapelDataResponse({
          data: filteredData,
          total: filteredData.length,
        });
      } catch (error) {
        toast.error("An error occurred while loading data");
      }
    };

    getSiswaData();
  }, [params.jurusan]);

  return (
    <div>
      {mapelDataResponse ? (
        <ListMapelView
          mapel={mapelDataResponse.data}
          total={mapelDataResponse.total}
        />
      ) : (
        <h1 style={{ marginTop: "20px" }}>Loading...</h1>
      )}
    </div>
  );
};

export default ListJurusanMapelPage;
``;
