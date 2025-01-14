// page.tsx
"use client";
import ListSiswaView from "@/components/views/DesktopMode/Siswa/ListSiswa";
import { useEffect, useState } from "react";
import dataSiswaServices from "@/services/dataSiswa";
import { Siswa } from "@/types/siswa.type";
import toast from "react-hot-toast";

const ListSiswaPage = () => {
  const [siswaDataResponse, setSiswaDataResponse] = useState<{
    data: Siswa[];
    total: number;
  } | null>(null);

  useEffect(() => {
    const getSiswaData = async () => {
      try {
        const { data } = await dataSiswaServices.getAllSiswa({
          page: 1,
          search: "",
        });
        console.log("data :" + data);
        setSiswaDataResponse(data);
      } catch (error) {
        toast.error("An error occurred while loading data");
      }
    };

    getSiswaData();
  }, []);

  return (
    <div>
      {siswaDataResponse ? (
        <ListSiswaView
          siswa={siswaDataResponse.data}
          total={siswaDataResponse.total}
        />
      ) : (
        <h1 style={{ marginTop: "20px" }}>Loading...</h1>
      )}
    </div>
  );
};

export default ListSiswaPage;
