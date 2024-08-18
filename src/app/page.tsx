"use client";

import DashboardView from "@/components/views/Dashboard";
import { useState, useEffect } from "react";
import dataSiswaServices from "@/services/dataSiswa";
import dataGuruServices from "@/services/dataGuru";
import dataMapelServices from "@/services/dataMapel";

export default function Home() {
  const [totalData, setTotalData] = useState({
    totalSiswa: 0,
    totalGuru: 0,
    totalMapel: 0,
  });

  const getAllData = async () => {
    try {
      const [siswaResponse, guruResponse, mapelResponse] = await Promise.all([
        dataSiswaServices.getAllSiswa({ page: 1, search: "" }),
        dataGuruServices.getAllGuru({ page: 1, search: "" }),
        dataMapelServices.getAllMapel({ page: 1, search: "" }),
      ]);

      const totalSiswa = siswaResponse.data.total;
      const totalGuru = guruResponse.data.total;
      const totalMapel = guruResponse.data.total;

      // Set hasil total siswa ke state
      setTotalData({
        totalSiswa,
        totalGuru,
        totalMapel,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);
  return (
    <main>
      <DashboardView totalData={totalData} />
    </main>
  );
}
