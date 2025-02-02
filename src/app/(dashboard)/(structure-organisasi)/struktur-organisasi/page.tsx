"use client";
import ListStructureOrganisasiView from "@/components/views/DesktopMode/StructureOrganisasi/ListStructureOrganisasi";
import dataStructureOrganisasiServices from "@/services/dataStructureOrganisasi";
import type { StructureOrganisasi } from "@/types/structureorganisasi.type";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const StructureOrganisasi = () => {
  const [strOrgDataResponse, setStrOrgDataResponse] = useState<{
    data: StructureOrganisasi[];
    total: number;
  } | null>(null);

  useEffect(() => {
    const getStrOrgData = async () => {
      try {
        const { data } = await dataStructureOrganisasiServices.getAllStrOrg({
          page: 1,
          search: "",
        });
        setStrOrgDataResponse(data);
      } catch (error) {
        toast.error("An error occurred while loading data");
      }
    };

    getStrOrgData();
  }, []);
  return (
    <>
      <ListStructureOrganisasiView
        data={strOrgDataResponse?.data || []}
        total={strOrgDataResponse?.total || 0}
      />
    </>
  );
};

export default StructureOrganisasi;
