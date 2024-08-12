import Modal from "@/components/ui/Modal";
import { Siswa } from "@/types/siswa.type";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "./DeleteListSiswa.module.scss";
import Button from "@/components/ui/Button";
import dataSiswaServices from "@/services/dataSiswa";

type PropTypes = {
  deletedSiswa: Siswa | any;
  setSiswaData: Dispatch<SetStateAction<Siswa[]>>;
  setDeletedSiswa: Dispatch<SetStateAction<Siswa | {}>>;
};
const DeleteListSiswa = ({
  deletedSiswa,
  setSiswaData,
  setDeletedSiswa,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const result = dataSiswaServices.deleteDataSiswa(deletedSiswa.nisn);
    setIsLoading(true);
  };
  return (
    <Modal onClose={() => console.log("dada")}>
      <div className={styles.modal}>
        <h1 className={styles.modal_title}>Delete Data?</h1>
        <p>
          Apakah kamu yakin ingin menghapus data dengan nisn{" "}
          <strong>{deletedSiswa?.nisn}</strong>?
        </p>
        <div className={styles.modal_action}>
          <Button
            type="button"
            className={styles.modal_action_delete}
            onClick={async () => handleDelete()}
          >
            {isLoading ? "Deleting..." : "Delete Data"}
          </Button>
          <Button type="button" className={styles.modal_action_cancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteListSiswa;
