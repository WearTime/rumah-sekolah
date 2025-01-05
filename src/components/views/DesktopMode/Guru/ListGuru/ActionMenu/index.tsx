import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./ActionMenu.module.scss";
import { Guru } from "@/types/guru.types";
import DeleteListGuru from "../DeleteListGuru";
import Modal from "@/components/ui/Modal";
import EditListGuru from "../EditListGuru";
import DetailListSiswa from "../../DetailListGuru";
import { useSession } from "next-auth/react";

type PropTypes = {
  setActionMenu: Dispatch<SetStateAction<Guru | null>>;
  actionMenu: Guru;
  setGuruData: Dispatch<SetStateAction<Guru[]>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  fetchPageData: (page: number) => Promise<void>;
  currentPage: number;
  ellipsisButtonRef: React.RefObject<SVGSVGElement>; // Add ref to the ellipsis button
};

const ActionMenu = ({
  setActionMenu,
  actionMenu,
  setGuruData,
  setCurrentPage,
  fetchPageData,
  currentPage,
  ellipsisButtonRef, // Ref passed from the parent
}: PropTypes) => {
  const { data } = useSession();
  const role = data?.user.role;
  const [deletedGuru, setDeletedGuru] = useState<Guru | null>(null);
  const [editGuru, setEditGuru] = useState<Guru | null>(null);
  const [detailGuru, setDetailGuru] = useState<Guru | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<{
    deleteModal: boolean;
    editModal: boolean;
    detailModal: boolean;
  }>({ deleteModal: false, editModal: false, detailModal: false });
  const [actionMenuPosition, setActionMenuPosition] = useState<{
    top: number;
    right: number;
  }>({ top: 0, right: 0 });

  const updatePosition = () => {
    if (ellipsisButtonRef.current) {
      const rect = ellipsisButtonRef.current.getBoundingClientRect();
      setActionMenuPosition({
        top: rect.bottom,
        right: rect.left - 115,
      });
    }
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
    };
  }, [ellipsisButtonRef]);

  const handleDeleteItem = () => {
    setDeletedGuru(actionMenu);
    setIsModalOpen({ deleteModal: true, editModal: false, detailModal: false });
  };

  return (
    <>
      <div
        className={`${styles.actionmenu} ${styles["actionmenu-active"]}`}
        style={{
          top: `${actionMenuPosition.top}px`,
          left: `${actionMenuPosition.right}px`,
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
              setDetailGuru(actionMenu);
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
            className={`${styles.actionmenu_content_list} ${
              role != "Admin" && styles["actionmenu_content_list-disabled"]
            }`}
            onClick={() => {
              setEditGuru(actionMenu);
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
            className={`${styles.actionmenu_content_list} ${
              role != "Admin" && styles["actionmenu_content_list-disabled"]
            }`}
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
          <DeleteListGuru
            deletedGuru={deletedGuru}
            setGuruData={setGuruData}
            setDeletedGuru={setDeletedGuru}
            setCurrentPage={setCurrentPage}
            fetchPageData={fetchPageData}
            setIsModalOpen={setIsModalOpen}
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
          <EditListGuru
            setActionMenu={setActionMenu}
            editGuru={editGuru}
            setGuruData={setGuruData}
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
          <DetailListSiswa detailGuru={detailGuru} />
        </Modal>
      )}
    </>
  );
};

export default ActionMenu;
