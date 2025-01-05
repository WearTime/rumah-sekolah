import { Dispatch, SetStateAction, useState } from "react";
import styles from "./DeleteListMapel.module.scss";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import dataMapelServices from "@/services/dataMapel";
import { Mapel } from "@/types/mapel.type";

type PropTypes = {
  deletedMapel: Mapel | null;
  setMapelData: Dispatch<SetStateAction<Mapel[]>>;
  setDeletedMapel: Dispatch<SetStateAction<Mapel | null>>;
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

const DeleteListMapel = ({
  deletedMapel,
  setMapelData,
  setDeletedMapel,
  setCurrentPage,
  fetchPageData,
  setIsModalOpen,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletedMapel) return;

    setIsLoading(true);
    const result = await dataMapelServices.deleteDataMapel(
      deletedMapel.kode_mapel
    );

    if (result.status === 200) {
      setIsLoading(false);
      setDeletedMapel(null);
      toast.success("Berhasil Hapus Data");
      const { data } = await dataMapelServices.getAllMapel({
        page: 1,
        search: "",
      });
      setMapelData(data.data);
      setCurrentPage(1);
      fetchPageData(1);
      setIsModalOpen({
        deleteModal: false,
        editModal: false,
        detailModal: false,
      });
    } else {
      setIsLoading(false);
      setDeletedMapel(null);
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
        Apakah kamu yakin ingin menghapus data dengan Kode{" "}
        <strong>{deletedMapel?.kode_mapel}</strong>?
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
            setDeletedMapel(null),
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

export default DeleteListMapel;
