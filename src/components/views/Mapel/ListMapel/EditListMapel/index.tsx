import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styles from "./EditListMapel.module.scss";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import { Mapel } from "@/types/mapel.type";
import mapelSchema from "@/validation/mapelSchema.validation";
import dataMapelServices from "@/services/dataMapel";

type PropTypes = {
  setActionMenu: Dispatch<SetStateAction<Mapel | null>>;
  editMapel: Mapel | null;
  setMapelData: Dispatch<SetStateAction<Mapel[]>>;
  setIsModalOpen: Dispatch<
    SetStateAction<{
      deleteModal: boolean;
      editModal: boolean;
    }>
  >;
  currentPage: number;
  fetchPageData: (page: number) => Promise<void>;
};

const EditListMapel = ({
  setActionMenu,
  editMapel,
  setMapelData,
  setIsModalOpen,
  currentPage,
  fetchPageData,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    const data: Mapel = {
      kode_mapel: form.kode_mapel.value,
      nama_mapel: form.nama_mapel.value,
      tipe_mapel: form.tipe_mapel.value,
      fase: form.fase.value,
    };
    const check = mapelSchema.safeParse(data);

    if (!check.success) {
      toast.error(check.error.errors[0].message);

      setIsLoading(false);
      return;
    }

    if (!editMapel?.kode_mapel) {
      toast.error("Kode Mapel is missing");
      setIsLoading(false);
      return;
    }

    formData.append("data", JSON.stringify(data));
    console.log(formData);

    const result = await dataMapelServices.editDataMapel(
      editMapel.kode_mapel,
      formData
    );

    if (result.status == 200) {
      setIsModalOpen({
        deleteModal: false,
        editModal: false,
      });
      setIsLoading(false);
      toast.success("Berhasil Update Data");
      const { data } = await dataMapelServices.getAllMapel({
        page: currentPage,
        search: "",
      });
      setMapelData(data.data);
      fetchPageData(currentPage);
      setActionMenu(null);
    } else {
      setIsModalOpen({
        deleteModal: false,
        editModal: false,
      });
      setIsLoading(false);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className={styles.modal}>
      <h1>Update Siswa</h1>
      <form className={styles.modal_form} onSubmit={handleSubmit}>
        <Input
          label="Kode Mapel"
          type="text"
          name="kode_mapel"
          defaultValue={editMapel?.kode_mapel}
          className={styles.modal_form_input}
        />
        <Input
          label="Nama Mapel"
          type="text"
          name="nama_mapel"
          defaultValue={editMapel?.nama_mapel}
          className={styles.modal_form_input}
        />
        <Input
          label="Fase"
          type="text"
          name="fase"
          defaultValue={editMapel?.fase}
          className={styles.modal_form_input}
        />

        <div className={styles.modal_form_group}>
          <div className={styles.modal_form_group_item}>
            <label htmlFor="tipe_mapel">Tipe Mapel</label>
            <select
              name="tipe_mapel"
              id="tipe_mapel"
              required
              defaultValue={editMapel?.tipe_mapel}
            >
              <option value="Umum">Umum</option>
              <option value="Jurusan">Jurusan</option>
            </select>
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Update Siswa"}
        </Button>
      </form>
    </div>
  );
};

export default EditListMapel;
