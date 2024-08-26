// page.tsx
"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ListGuruView from "@/components/views/DesktopMode/Guru/ListGuru";
import { Guru } from "@/types/guru.types";
import dataGuruServices from "@/services/dataGuru";

const ListSiswaPage = () => {
  const [guruDataResponse, setGuruDataResponse] = useState<{
    data: Guru[];
    total: number;
  } | null>(null);

  useEffect(() => {
    const getSiswaData = async () => {
      try {
        const { data } = await dataGuruServices.getAllGuru({
          page: 1,
          search: "",
        });
        setGuruDataResponse(data);
      } catch (error) {
        toast.error("An error occurred while loading data");
      }
    };

    getSiswaData();
  }, []);

  return (
    <div>
      {guruDataResponse ? (
        <ListGuruView
          guru={guruDataResponse.data}
          total={guruDataResponse.total}
        />
      ) : (
        <h1 style={{ marginTop: "20px" }}>Loading...</h1>
      )}
    </div>
  );
};

export default ListSiswaPage;
