import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./ActionMenu.module.scss";
import Modal from "@/components/ui/Modal";
import { Mapel } from "@/types/mapel.type";
import DeleteListMapel from "../DeleteListMapel";
import EditListMapel from "../EditListMapel";

type PropTypes = {
  setActionMenu: Dispatch<SetStateAction<Mapel | null>>;
  actionMenu: Mapel;
  setMapelData: Dispatch<SetStateAction<Mapel[]>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  fetchPageData: (page: number) => Promise<void>;
  currentPage: number;
  ellipsisButtonRef: React.RefObject<SVGSVGElement>;
};

const ActionMenu = ({
  setActionMenu,
  actionMenu,
  setMapelData,
  setCurrentPage,
  fetchPageData,
  currentPage,
  ellipsisButtonRef,
}: PropTypes) => {
  const [deletedMapel, setDeletedMapel] = useState<Mapel | null>(null);
  const [editMapel, setEditMapel] = useState<Mapel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<{
    deleteModal: boolean;
    editModal: boolean;
  }>({ deleteModal: false, editModal: false });

  const [actionMenuPosition, setActionMenuPosition] = useState<{
    top: number;
    // left: number;
  }>({ top: 0 });

  const updatePosition = () => {
    if (ellipsisButtonRef.current) {
      const rect = ellipsisButtonRef.current.getBoundingClientRect();
      setActionMenuPosition({
        top: rect.bottom,
      });
    }
  };

  useEffect(() => {
    // Set posisi awal dan tambahkan event listener untuk window resize
    updatePosition();
    window.addEventListener("resize", updatePosition);

    // Hapus event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [ellipsisButtonRef]);
  const handleDeleteItem = () => {
    setDeletedMapel(actionMenu);
    setIsModalOpen({ deleteModal: true, editModal: false });
  };

  return (
    <>
      <div
        className={`${styles.actionmenu} ${styles["actionmenu-active"]}`}
        style={{
          position: "fixed",
          top: `${actionMenuPosition.top}px`,
          // left: `${actionMenuPosition.left}px`,
        }}
      >
        <div className={styles.actionmenu_header}>
          <h1 className={styles.actionmenu_header_title}>Actions</h1>
        </div>
        <div className={styles.actionmenu_content}>
          <button
            type="button"
            className={styles.actionmenu_content_list}
            onClick={() => {
              setEditMapel(actionMenu);
              setIsModalOpen({
                deleteModal: false,
                editModal: true,
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
            })
          }
        >
          <DeleteListMapel
            deletedMapel={deletedMapel}
            setMapelData={setMapelData}
            setDeletedMapel={setDeletedMapel}
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
    </>
  );
};

export default ActionMenu;
