"use client";
import styles from "./ListStructureOrganisasi.module.scss";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import ListTableLayout from "@/components/layouts/ListTableLayout";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { StructureOrganisasi } from "@/types/structureorganisasi.type";
import dataStructureOrganisasiServices from "@/services/dataStructureOrganisasi";
import Image from "next/image";
type PropTypes = {
  data: StructureOrganisasi[];
  total: number;
};

type Action = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: IconName;
};

const SEARCH_DELAY = 1000; // Delay untuk debounce
const ListStructureOrganisasiView = ({ data, total }: PropTypes) => {
  const { debounce } = useDebounce();
  const [strOrgData, setStrOrgData] = useState<StructureOrganisasi[]>(data);
  const [actionMenu, setActionMenu] = useState<StructureOrganisasi | null>(
    null
  );

  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(total);
  const [deletedStrOrg, setDeletedStrOrg] =
    useState<StructureOrganisasi | null>(null);

  const [editStrOrg, setEditStrOrg] = useState<StructureOrganisasi | null>(
    null
  );
  const [detailStrOrg, setDetailStrOrg] = useState<StructureOrganisasi | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<{
    deleteModal: boolean;
    editModal: boolean;
    detailModal: boolean;
  }>({ deleteModal: false, editModal: false, detailModal: false });

  const fetchPageData = async (page: number) => {
    const response = await dataStructureOrganisasiServices.getAllStrOrg({
      page,
      search,
    });
    const { data, total: newTotal } = response.data;
    setStrOrgData(data);
    setTotalItems(newTotal);
    setCurrentPage(page);
  };

  const performSearch = () => {
    if (search !== "") {
      fetchPageData(1);
    } else {
      setStrOrgData(data);
      setTotalItems(total);
    }
  };

  const debounceSearch = debounce(performSearch, SEARCH_DELAY);
  useEffect(() => {
    fetchPageData(1);
  }, [data, total]);
  useEffect(() => {
    debounceSearch();
  }, [search]);

  const handleDetail = () => {
    setDetailStrOrg(actionMenu);
    setIsModalOpen({
      deleteModal: false,
      editModal: false,
      detailModal: true,
    });
  };
  const handleEdit = () => {
    setEditStrOrg(actionMenu);
    setIsModalOpen({
      deleteModal: false,
      editModal: true,
      detailModal: false,
    });
  };

  const handleDelete = () => {
    setDeletedStrOrg(actionMenu);
    setIsModalOpen({ deleteModal: true, editModal: false, detailModal: false });
  };
  const processedData = strOrgData.map((item) => ({
    ...item,
    nama: item.guru?.nama || "Tidak Ada Nama",
  }));

  const headers = [
    { key: "nip", label: "NIP" },
    { key: "orgNama", label: "Nama" },
    { key: "jabatan", label: "Jabatan" },
  ];
  const actions: Action[] = [
    {
      label: "Detail",
      onClick: handleDetail,
      disabled: false,
    },
    {
      label: "Edit",
      onClick: handleEdit,
      disabled: false,
      icon: "pen-to-square",
    },
    { label: "Delete", onClick: handleDelete, disabled: false, icon: "trash" },
  ];
  return (
    <>
      <div className={styles.listsiswa}>
        <div className={styles.listsiswa_search}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Cari nama siswa"
            className={styles.listsiswa_search_input}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.listsiswa_image}>
          <Image
            src={"/structure-organisasi.png"}
            alt="structure-organisasi"
            width={1090}
            height={550}
          />
        </div>
        <ListTableLayout
          data={strOrgData}
          headers={headers}
          currentPage={currentPage}
          pageSize={pageSize}
          identifierKey={"nip"}
          actions={actions}
          setActionMenu={setActionMenu}
          actionMenu={actionMenu}
          totalItems={totalItems}
          fetchPageData={fetchPageData}
        />
      </div>
      {/* {isModalOpen.deleteModal && (
        <Modal
          onClose={() =>
            setIsModalOpen({
              deleteModal: false,
              editModal: false,
              detailModal: false,
            })
          }
        >
          <DeleteListSiswa
            deletedSiswa={deletedSiswa}
            setStrOrgData={setStrOrgData}
            setDeletedSiswa={setDeletedSiswa}
            setIsModalOpen={setIsModalOpen}
            setCurrentPage={setCurrentPage}
            fetchPageData={fetchPageData}
          />
        </Modal>
      )}
      {isModalOpen.editModal && (
        <Modal
          onClose={() =>
            setIsModalOpen({
              deleteModal: false,
              editModal: false,
              detailModal: false,
            })
          }
        >
          <EditListSiswa
            setActionMenu={setActionMenu}
            editSiswa={editSiswa}
            setStrOrgData={setStrOrgData}
            setIsModalOpen={setIsModalOpen}
            currentPage={currentPage}
            fetchPageData={fetchPageData}
          />
        </Modal>
      )}
      {isModalOpen.detailModal && (
        <Modal
          onClose={() =>
            setIsModalOpen({
              deleteModal: false,
              editModal: false,
              detailModal: false,
            })
          }
        >
          <DetailListSiswa detailSiswa={detailSiswa} />
        </Modal>
      )} */}
    </>
  );
};

export default ListStructureOrganisasiView;
