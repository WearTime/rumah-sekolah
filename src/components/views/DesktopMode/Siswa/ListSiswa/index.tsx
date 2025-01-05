"use client";
import styles from "./Listsiswa.module.scss";
import { useEffect, useState } from "react";
import { Siswa } from "@/types/siswa.type";
import dataSiswaServices from "@/services/dataSiswa";
import useDebounce from "@/hooks/useDebounce";
import ListTableLayout from "@/components/layouts/ListTableLayout";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import Modal from "@/components/ui/Modal";
import DeleteListSiswa from "./DeleteListSiswa";
import DetailListSiswa from "./DetailListSiswa";
import EditListSiswa from "./EditListSiswa";

type PropTypes = {
  siswa: Siswa[];
  total: number;
};

type Action = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: IconName;
};

const SEARCH_DELAY = 1000; // Delay untuk debounce

const ListSiswaView = ({ siswa, total }: PropTypes) => {
  const { debounce } = useDebounce();
  const [siswaData, setSiswaData] = useState<Siswa[]>([]);
  const [actionMenu, setActionMenu] = useState<Siswa | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [deletedSiswa, setDeletedSiswa] = useState<Siswa | null>(null);
  const [editSiswa, setEditSiswa] = useState<Siswa | null>(null);
  const [detailSiswa, setDetailSiswa] = useState<Siswa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<{
    deleteModal: boolean;
    editModal: boolean;
    detailModal: boolean;
  }>({ deleteModal: false, editModal: false, detailModal: false });

  const fetchPageData = async (page: number) => {
    const { data } = await dataSiswaServices.getAllSiswa({ page, search });
    setSiswaData(data.data);
    setCurrentPage(page);
  };

  const performSearch = () => {
    if (search !== "") {
      fetchPageData(1);
    } else {
      setSiswaData(siswa);
    }
  };

  const debounceSearch = debounce(performSearch, SEARCH_DELAY);

  useEffect(() => {
    debounceSearch();
  }, [search]);

  const handleDetail = () => {
    setDetailSiswa(actionMenu);
    setIsModalOpen({
      deleteModal: false,
      editModal: false,
      detailModal: true,
    });
  };
  const handleEdit = () => {
    setEditSiswa(actionMenu);
    setIsModalOpen({
      deleteModal: false,
      editModal: true,
      detailModal: false,
    });
  };

  const handleDelete = () => {
    setDeletedSiswa(actionMenu);
    setIsModalOpen({ deleteModal: true, editModal: false, detailModal: false });
  };

  const headers = [
    { key: "nama", label: "Nama" },
    { key: "nisn", label: "NISN" },
    { key: "kelas", label: "Kelas", mobileDelete: true },
    { key: "jurusan", label: "Jurusan", mobileDelete: true },
    { key: "no_hp", label: "No HP", tabletDelete: true },
    { key: "alamat", label: "Alamat", tabletDelete: true },
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
        <ListTableLayout
          data={siswaData}
          headers={headers}
          currentPage={currentPage}
          pageSize={pageSize}
          identifierKey={"nisn"}
          actions={actions}
          setActionMenu={setActionMenu}
          actionMenu={actionMenu}
          totalItems={total}
          fetchPageData={fetchPageData}
        />
      </div>
      {isModalOpen.deleteModal && (
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
            setSiswaData={setSiswaData}
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
            setSiswaData={setSiswaData}
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
      )}
    </>
  );
};

export default ListSiswaView;
