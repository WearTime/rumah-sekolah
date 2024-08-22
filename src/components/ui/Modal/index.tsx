import { useEffect, useRef } from "react";
import styles from "./Moda.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PropsTypes = {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
};

const Modal = ({ children, onClose, className }: PropsTypes) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.modal}>
      <div className={`${styles.modal__main} ${className}`} ref={ref}>
        <FontAwesomeIcon
          icon={["fas", "xmark"]}
          className={styles.modal__main__close}
          onClick={() => onClose()}
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
