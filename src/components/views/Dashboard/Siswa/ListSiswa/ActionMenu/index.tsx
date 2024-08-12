import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./ActionMenu.module.scss";
import { Siswa } from "@/types/siswa.type";
import DeleteListSiswa from "../DeleteListSiswa";

type PropTypes = {
  setActionMenu: Dispatch<SetStateAction<Siswa | {}>>;
  actionMenu: Siswa | {};
  setSiswaData: Dispatch<SetStateAction<Siswa[]>>;
};
const ActionMenu = ({ setActionMenu, actionMenu, setSiswaData }: PropTypes) => {
  const [deletedSiswa, setDeletedSiswa] = useState<Siswa | {}>({});

  const ref: any = useRef();
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setActionMenu({});
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
          <button type="button" className={styles.actionmenu_content_list}>
            <p>Detail item</p>
          </button>
          <button type="button" className={styles.actionmenu_content_list}>
            <p>Edit item</p>
          </button>
          <button type="button" className={styles.actionmenu_content_list}>
            <p onClick={() => setDeletedSiswa(actionMenu)}>Delete item</p>
          </button>
        </div>
      </div>
      {Object.keys(deletedSiswa).length > 0 && (
        <DeleteListSiswa
          deletedSiswa={deletedSiswa}
          setSiswaData={setSiswaData}
          setDeletedSiswa={setDeletedSiswa}
        />
      )}
    </>
  );
};

export default ActionMenu;
