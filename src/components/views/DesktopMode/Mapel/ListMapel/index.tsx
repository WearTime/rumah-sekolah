"use client";
import styles from "./Listmapel.module.scss";
import GuruModalMapel from "./GuruModalMapel"; // Import GuruModalMapel
import { SetStateAction, useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Mapel } from "@/types/mapel.type";
import dataMapelServices from "@/services/dataMapel";
import Modal from "@/components/ui/Modal";
import DeleteListMapel from "./DeleteListMapel";
import EditListMapel from "./EditListMapel";
import ListTableLayout from "@/components/layouts/ListTableLayout";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import DetailListMapel from "./DetailListMapel";

type PropTypes = {
  mapel: Mapel[];
  total: number;
};

type Action = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: IconName;
};

const SEARCH_DELAY = 1000;

const ListMapelView = ({ mapel, total }: PropTypes) => {
  const { debounce } = useDebounce();
  const [mapelData, setMapelData] = useState<Mapel[]>([]);
  const [actionMenu, setActionMenu] = useState<Mapel | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedMapel, setSelectedMapel] = useState<Mapel | null>(null);
  const [isGuruModalOpen, setIsGuruModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<{
    deleteModal: boolean;
    editModal: boolean;
    detailModal: boolean;
  }>({ deleteModal: false, editModal: false, detailModal: false });
  const [deletedMapel, setDeletedMapel] = useState<Mapel | null>(null);
  const [editMapel, setEditMapel] = useState<Mapel | null>(null);
  const [detailMapel, setDetailMapel] = useState<Mapel | null>(null);

  const handleDetail = () => {
    setDetailMapel(actionMenu);
    setIsModalOpen({
      deleteModal: false,
      editModal: false,
      detailModal: true,
    });
  };
  const handleEdit = () => {
    setEditMapel(actionMenu);
    setIsModalOpen({
      deleteModal: false,
      editModal: true,
      detailModal: false,
    });
  };

  const handleDelete = () => {
    setDeletedMapel(actionMenu);
    setIsModalOpen({
      deleteModal: true,
      editModal: false,
      detailModal: false,
    });
  };
  const fetchPageData = async (page: number) => {
    const { data } = await dataMapelServices.getAllMapel({ page, search });
    setMapelData(data.data);
    setCurrentPage(page);
  };

  const performSearch = () => {
    if (search !== "") {
      fetchPageData(1);
    } else {
      setMapelData(mapel);
    }
  };

  const debounceSearch = debounce(performSearch, SEARCH_DELAY);

  useEffect(() => {
    debounceSearch();
  }, [search]);

  const headers = [
    { key: "kode_mapel", label: "Kode" },
    { key: "nama_mapel", label: "Nama" },
    { key: "fase", label: "Fase", tabletDelete: true },
    { key: "tipe_mapel", label: "Tipe", mobileDelete: true },
    { key: "jurusan", label: "Jurusan", mobileDelete: true },
    { key: "mapel", label: "Guru Pengajar" },
  ];

  console.log(mapelData)

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
      <div className={styles.listmapel}>
        <div className={styles.listmapel_search}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Cari nama siswa"
            className={styles.listmapel_search_input}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <ListTableLayout
          data={mapelData}
          headers={headers}
          currentPage={currentPage}
          pageSize={pageSize}
          identifierKey={"kode_mapel"}
          actions={actions}
          setActionMenu={setActionMenu}
          actionMenu={actionMenu}
          setIsItemModalOpen={setIsGuruModalOpen}
          setSelectedItem={setSelectedMapel}
          totalItems={total}
          fetchPageData={fetchPageData}
        />
      </div>
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
          <DetailListMapel detailMapel={detailMapel} />
        </Modal>
      )}
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
          <DeleteListMapel
            deletedMapel={deletedMapel}
            setMapelData={setMapelData}
            setDeletedMapel={setDeletedMapel}
            setCurrentPage={setCurrentPage}
            setIsModalOpen={setIsModalOpen}
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
          <EditListMapel
            setActionMenu={setActionMenu}
            editMapel={editMapel}
            setMapelData={setMapelData}
            setIsModalOpen={setIsModalOpen}
            currentPage={currentPage}
            fetchPageData={fetchPageData}
          />
        </Modal>
      )}
      {isGuruModalOpen && selectedMapel && (
        <GuruModalMapel
          mapel={selectedMapel}
          onClose={() => setIsGuruModalOpen(false)}
        />
      )}
    </>
  );
};

export default ListMapelView;
