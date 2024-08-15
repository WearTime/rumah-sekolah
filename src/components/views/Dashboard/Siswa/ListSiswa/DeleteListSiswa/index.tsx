import Modal from "@/components/ui/Modal";
import { Siswa } from "@/types/siswa.type";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "./DeleteListSiswa.module.scss";
import Button from "@/components/ui/Button";
import dataSiswaServices from "@/services/dataSiswa";
import toast from "react-hot-toast";

type PropTypes = {
  deletedSiswa: Siswa | null;
  setSiswaData: Dispatch<SetStateAction<Siswa[]>>;
  setDeletedSiswa: Dispatch<SetStateAction<Siswa | null>>;
};

const DeleteListSiswa = ({
  deletedSiswa,
  setSiswaData,
  setDeletedSiswa,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletedSiswa) return;

    setIsLoading(true);
    const result = await dataSiswaServices.deleteDataSiswa(deletedSiswa.nisn);

    if (result.status === 200) {
      setIsLoading(false);
      setDeletedSiswa(null);
      toast.success("Berhasil Hapus Data");
      const { data } = await dataSiswaServices.getAllSiswa({
        page: 1,
        search: "",
      });
      setSiswaData(data.data);
    } else {
      setIsLoading(false);
      setDeletedSiswa(null);
      toast.error("Gagal Hapus Data");
    }
  };

  return (
    <div className={styles.modal}>
      <h1 className={styles.modal_title}>Delete Data?</h1>
      <p>
        Apakah kamu yakin ingin menghapus data dengan NISN{" "}
        <strong>{deletedSiswa?.nisn}</strong>?
      </p>
      <div className={styles.modal_action}>
        <Button
          type="button"
          className={styles.modal_action_delete}
          onClick={handleDelete}
        >
          {isLoading ? "Deleting..." : "Delete Data"}
        </Button>
        <Button
          type="button"
          className={styles.modal_action_cancel}
          onClick={() => setDeletedSiswa(null)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteListSiswa;
