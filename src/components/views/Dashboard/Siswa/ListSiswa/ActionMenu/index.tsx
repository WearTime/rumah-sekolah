import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./ActionMenu.module.scss";
import { Siswa } from "@/types/siswa.type";
import DeleteListSiswa from "../DeleteListSiswa";
import Modal from "@/components/ui/Modal";

type PropTypes = {
  setActionMenu: Dispatch<SetStateAction<Siswa | {}>>;
  actionMenu: Siswa | {};
  setSiswaData: Dispatch<SetStateAction<Siswa[]>>;
};

const ActionMenu = ({ setActionMenu, actionMenu, setSiswaData }: PropTypes) => {
  const [deletedSiswa, setDeletedSiswa] = useState<Siswa | {}>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);
  const handleDeleteItem = () => {
    setDeletedSiswa(actionMenu);
    setIsModalOpen(true); // Open the modal
    // setActionMenu({}); // Close the ActionMenu
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // setActionMenu({});
        console.log(ref.current.hasAttribute("data-actionmenu-active"));
        console.log(ref.current);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActionMenu]);

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
              // Logic for "Detail item"
            }}
          >
            <p>Detail item</p>
          </button>
          <button
            type="button"
            className={styles.actionmenu_content_list}
            onClick={() => {
              // Logic for "Edit item"
            }}
          >
            <p>Edit item</p>
          </button>
          <button
            type="button"
            data-actionmenu-active
            className={styles.actionmenu_content_list}
            onClick={handleDeleteItem}
          >
            <p>Delete item</p>
          </button>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <DeleteListSiswa
            deletedSiswa={deletedSiswa}
            setSiswaData={setSiswaData}
            setDeletedSiswa={setDeletedSiswa}
          />
        </Modal>
      )}
    </>
  );
};

export default ActionMenu;
