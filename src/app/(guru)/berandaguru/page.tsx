"use client";
import BerandaGuruView from "@/components/views/Guru/BerandaGuru";
import dataGuruServices from "@/services/dataGuru";
import { Guru } from "@/types/guru.types";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const BerandaGuruPage = () => {
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
        <BerandaGuruView
          guru={guruDataResponse.data}
          total={guruDataResponse.total}
        />
      ) : (
        <h1 style={{ marginTop: "20px" }}>Loading...</h1>
      )}
    </div>
  );
};

export default BerandaGuruPage;
