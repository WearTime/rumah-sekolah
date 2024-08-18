import { Dispatch, SetStateAction, useState } from "react";
import styles from "./DeleteListGuru.module.scss";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Guru } from "@/types/guru.types";
import dataGuruServices from "@/services/dataGuru";

type PropTypes = {
  deletedGuru: Guru | null;
  setGuruData: Dispatch<SetStateAction<Guru[]>>;
  setDeletedGuru: Dispatch<SetStateAction<Guru | null>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  fetchPageData: (page: number) => Promise<void>;
};

const DeleteListGuru = ({
  deletedGuru,
  setGuruData,
  setDeletedGuru,
  setCurrentPage,
  fetchPageData,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletedGuru) return;

    setIsLoading(true);
    const result = await dataGuruServices.deleteDataGuru(deletedGuru.nip);

    if (result.status === 200) {
      setIsLoading(false);
      setDeletedGuru(null);
      toast.success("Berhasil Hapus Data");
      const { data } = await dataGuruServices.getAllGuru({
        page: 1,
        search: "",
      });
      setGuruData(data.data);
      setCurrentPage(1);
      fetchPageData(1);
    } else {
      setIsLoading(false);
      setDeletedGuru(null);
      toast.error("Gagal Hapus Data");
    }
  };

  return (
    <div className={styles.modal}>
      <h1 className={styles.modal_title}>Delete Data?</h1>
      <p>
        Apakah kamu yakin ingin menghapus data dengan NIP{" "}
        <strong>{deletedGuru?.nip}</strong>?
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
          onClick={() => setDeletedGuru(null)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteListGuru;
