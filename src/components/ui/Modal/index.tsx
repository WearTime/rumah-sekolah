import { Dispatch, useEffect, useRef } from "react";
import styles from "./Moda.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PropsTypes = {
  children: React.ReactNode;
  onClose: any;
};
const Modal = ({ children, onClose }: PropsTypes) => {
  const ref: any = useRef();
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
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
      <div className={styles.modal__main} ref={ref}>
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
