"use client";
import styles from "./Listmapel.module.scss";
import { Dispatch, SetStateAction } from "react";
import { Mapel } from "@/types/mapel.type";
import ListTable from "@/components/fragments/ListTable";
import { Guru } from "@/types/guru.types";
import { Siswa } from "@/types/siswa.type";
import MobileListTable from "@/components/fragments/MobileListTable";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import Pagination from "@/components/fragments/Pagination";
import { StructureOrganisasi } from "@/types/structureorganisasi.type";

type Action = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: IconName;
};

type Header = {
  key: string;
  label: string;
};
type PropTypes<T extends Guru | Siswa | Mapel | StructureOrganisasi> = {
  setActionMenu: Dispatch<SetStateAction<T | null>>;
  setIsItemModalOpen?: Dispatch<SetStateAction<boolean>>;
  setSelectedItem?: Dispatch<SetStateAction<T | null>>;
  actionMenu: T | null;
  data: T[];
  headers: Header[];
  currentPage: number;
  pageSize: number;
  identifierKey: keyof T;
  actions: Action[];
  totalItems: number;
  fetchPageData: (currentPage: number) => void;
};

const ListTableLayout = <T extends Guru | Siswa | Mapel | StructureOrganisasi>({
  actionMenu,
  setActionMenu,
  setIsItemModalOpen,
  setSelectedItem,
  data,
  headers,
  currentPage,
  pageSize,
  identifierKey,
  actions,
  totalItems,
  fetchPageData,
}: PropTypes<T>) => {
  return (
    <>
      <ListTable
        data={data}
        headers={headers}
        currentPage={currentPage}
        pageSize={pageSize}
        identifierKey={identifierKey}
        actions={actions}
        setActionMenu={setActionMenu}
        actionMenu={actionMenu}
        setIsItemModalOpen={setIsItemModalOpen}
        setSelectedItem={setSelectedItem}
      />
      <MobileListTable
        setSelectedItem={setSelectedItem}
        setIsItemModalOpen={setIsItemModalOpen}
        total={0}
        data={data}
        headers={headers}
        actions={actions}
        setActionMenu={setActionMenu}
        actionMenu={actionMenu}
        identifierKey={identifierKey}
      />
      <Pagination
        setActionMenu={setActionMenu}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        fetchPageData={fetchPageData}
      />
    </>
  );
};

export default ListTableLayout;
