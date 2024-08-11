import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import styles from "./ActionMenu.module.scss";

type PropTypes = {
  setToggleActionMenu: Dispatch<SetStateAction<boolean>>;
  toggleActionMenu: boolean;
};
const ActionMenu = ({ setToggleActionMenu, toggleActionMenu }: PropTypes) => {
  const ref: any = useRef();
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setToggleActionMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setToggleActionMenu]);
  return (
    <div
      className={`${styles.actionmenu} ${
        toggleActionMenu && styles["actionmenu-active"]
      }`}
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
          <p>Delete item</p>
        </button>
      </div>
    </div>
  );
};

export default ActionMenu;
