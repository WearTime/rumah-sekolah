// page.tsx
"use client";
import ListMapelView from "@/components/views/DesktopMode/Mapel/ListMapel";
import dataMapelServices from "@/services/dataMapel";
import { Mapel } from "@/types/mapel.type";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ListMapelPage = () => {
  const [mapelDataResponse, setMapelDataResponse] = useState<{
    data: Mapel[];
    total: number;
  } | null>(null);

  useEffect(() => {
    const getSiswaData = async () => {
      try {
        const { data } = await dataMapelServices.getAllMapel({
          page: 1,
          search: "",
        });
        setMapelDataResponse(data);
      } catch (error) {
        toast.error("An error occurred while loading data");
      }
    };

    getSiswaData();
  }, []);

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

export default ListMapelPage;
