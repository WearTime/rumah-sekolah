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
  setCurrentPage: Dispatch<SetStateAction<number>>;
  fetchPageData: (page: number) => Promise<void>;
  setIsModalOpen: Dispatch<
    SetStateAction<{
      deleteModal: boolean;
      editModal: boolean;
      detailModal: boolean;
    }>
  >;
};

const DeleteListSiswa = ({
  deletedSiswa,
  setSiswaData,
  setDeletedSiswa,
  setCurrentPage,
  fetchPageData,
  setIsModalOpen,
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
      setCurrentPage(1);
      fetchPageData(1);
      setIsModalOpen({
        deleteModal: false,
        editModal: false,
        detailModal: false,
      });
    } else {
      setIsLoading(false);
      setDeletedSiswa(null);
      toast.error("Gagal Hapus Data");
      setIsModalOpen({
        deleteModal: false,
        editModal: false,
        detailModal: false,
      });
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
          onClick={() => (
            setDeletedSiswa(null),
            setIsModalOpen({
              deleteModal: false,
              editModal: false,
              detailModal: false,
            })
          )}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteListSiswa;
