import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./ActionMenu.module.scss";
import { Siswa } from "@/types/siswa.type";
import DeleteListSiswa from "../DeleteListSiswa";
import Modal from "@/components/ui/Modal";
import EditListSiswa from "../EditListSiswa";
import DetailListSiswa from "../DetailListSiswa";
import dataSiswaServices from "@/services/dataSiswa";

type PropTypes = {
  setActionMenu: Dispatch<SetStateAction<Siswa | null>>;
  actionMenu: Siswa;
  setSiswaData: Dispatch<SetStateAction<Siswa[]>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  fetchPageData: (page: number) => Promise<void>;
  currentPage: number;
};

const ActionMenu = ({
  setActionMenu,
  actionMenu,
  setSiswaData,
  setCurrentPage,
  fetchPageData,
  currentPage,
}: PropTypes) => {
  const [deletedSiswa, setDeletedSiswa] = useState<Siswa | null>(null);
  const [editSiswa, setEditSiswa] = useState<Siswa | null>(null);
  const [detailSiswa, setDetailSiswa] = useState<Siswa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<{
    deleteModal: boolean;
    editModal: boolean;
    detailModal: boolean;
  }>({ deleteModal: false, editModal: false, detailModal: false });
  const ref = useRef<HTMLDivElement>(null);

  const handleDeleteItem = () => {
    setDeletedSiswa(actionMenu);
    setIsModalOpen({ deleteModal: true, editModal: false, detailModal: false });
  };

  return (
    <>
      <div
        className={`${styles.actionmenu} ${styles["actionmenu-active"]}`}
        ref={ref}
      >
        <div className={styles.actionmenu_header}>
          <h1 className={styles.actionmenu_header_title}>Actions</h1>
        </div>
        <div className={styles.actionmenu_content}>
          <button
            type="button"
            className={styles.actionmenu_content_list}
            onClick={() => {
              setDetailSiswa(actionMenu);
              setIsModalOpen({
                deleteModal: false,
                editModal: false,
                detailModal: true,
              });
            }}
          >
            <p>Detail item</p>
          </button>
          <button
            type="button"
            className={styles.actionmenu_content_list}
            onClick={() => {
              setEditSiswa(actionMenu);
              setIsModalOpen({
                deleteModal: false,
                editModal: true,
                detailModal: false,
              });
            }}
          >
            <p>Edit item</p>
          </button>
          <button
            type="button"
            className={styles.actionmenu_content_list}
            onClick={handleDeleteItem}
          >
            <p>Delete item</p>
          </button>
        </div>
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
          <DetailListSiswa
            detailSiswa={detailSiswa}
            setSiswaData={setSiswaData}
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      )}
    </>
  );
};

export default ActionMenu;
