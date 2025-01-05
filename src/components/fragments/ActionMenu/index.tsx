import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./ActionMenu.module.scss";

type Action = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type ActionMenuProps = {
  positionRef: React.RefObject<SVGSVGElement>;
  actions: Action[];
};

const ActionMenu = ({ positionRef, actions }: ActionMenuProps) => {
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  }>({
    top: 0,
    right: 0,
  });
  const updatePosition = () => {
    if (positionRef.current) {
      const rect = positionRef.current.getBoundingClientRect();
      setMenuPosition({
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
  }, [positionRef]);

  return (
    <div
      className={`${styles.actionmenu} ${styles["actionmenu-active"]}`}
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.right}px`,
      }}
    >
      <div className={styles.actionmenu_header}>
        <h1 className={styles.actionmenu_header_title}>Actions</h1>
      </div>
      <div className={styles.actionmenu_content}>
        {actions.map((action, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.actionmenu_content_list} ${
              action.disabled && styles["actionmenu_content_list-disabled"]
            }`}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            <p>{action.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionMenu;
