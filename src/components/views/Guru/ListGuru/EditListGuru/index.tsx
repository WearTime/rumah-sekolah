import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styles from "./EditListGuru.module.scss";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Image from "next/image";
import InputFile from "@/components/ui/InputFile";
import { Guru } from "@/types/guru.types";
import guruSchema from "@/validation/guruSchema.validation";
import dataGuruServices from "@/services/dataGuru";
import { AxiosError } from "axios";

type PropTypes = {
  setActionMenu: Dispatch<SetStateAction<Guru | null>>;
  editGuru: Guru | null;
  setGuruData: Dispatch<SetStateAction<Guru[]>>;
  setIsModalOpen: Dispatch<
    SetStateAction<{
      deleteModal: boolean;
      editModal: boolean;
      detailModal: boolean;
    }>
  >;
  currentPage: number;
  fetchPageData: (page: number) => Promise<void>;
};

const EditListGuru = ({
  setActionMenu,
  editGuru,
  setGuruData,
  setIsModalOpen,
  currentPage,
  fetchPageData,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    const data: Guru = {
      nama: form.nama.value,
      nip: form.nip.value,
      mapel: form.mapel.value,
      no_hp: form.no_hp.value,
      alamat: form.alamat.value,
    };
    const check = guruSchema.safeParse(data);

    if (!check.success) {
      toast.error(check.error.errors[0].message);

      setIsLoading(false);
      return;
    }

    if (!editGuru?.nip) {
      toast.error("NISN is missing");
      setIsLoading(false);
      return;
    }

    formData.append("data", JSON.stringify(data));
    if (form.image.files[0]) {
      formData.append("image", form.image.files[0]);
    }

    try {
      const result = await dataGuruServices.editDataGuru(
        editGuru.nip,
        formData
      );

      if (result.status == 200) {
        toast.success("Berhasil Update Data");
        const { data } = await dataGuruServices.getAllGuru({
          page: currentPage,
          search: "",
        });
        setGuruData(data.data);
        fetchPageData(currentPage);
        setActionMenu(null);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unknown error occurred!");
      }
    } finally {
      setIsLoading(false);
      setIsModalOpen({
        deleteModal: false,
        editModal: false,
        detailModal: false,
      });
    }
  };

  return (
    <div className={styles.modal}>
      <h1>Update Guru</h1>
      <form className={styles.modal_form} onSubmit={handleSubmit}>
        <Input
          label="Nama"
          type="text"
          name="nama"
          defaultValue={editGuru?.nama}
          className={styles.modal_form_input}
        />
        <Input
          label="NIP"
          type="number"
          name="nip"
          defaultValue={editGuru?.nip}
          className={styles.modal_form_input}
        />
        <Input
          label="Mapel"
          type="text"
          name="mapel"
          defaultValue={editGuru?.mapel}
          className={styles.modal_form_input}
        />
        <Input
          label="NO HP"
          type="number"
          name="no_hp"
          defaultValue={editGuru?.no_hp}
          className={styles.modal_form_input}
        />
        <div className={styles.modal_form_group}>
          <div className={styles.modal_form_group_item}>
            <label htmlFor="alamat">Alamat</label>
            <textarea
              name="alamat"
              id="alamat"
              cols={20}
              rows={2}
              required
              defaultValue={editGuru?.alamat}
            />
          </div>
        </div>
        <div className={styles.modal_form_group_item}>
          <div className={styles.modal_form_group_item_image}>
            {editGuru?.image ? (
              <Image
                width={100}
                height={100}
                src={
                  uploadedImage
                    ? URL.createObjectURL(uploadedImage)
                    : `http://localhost:3000${editGuru?.image}`
                }
                alt="image"
                className={styles.modal_form_group_item_preview}
              />
            ) : (
              <div className={styles.modal_form_group_item_placeholder}>
                No Image
              </div>
            )}
            <InputFile
              name="image"
              accept=".jpg, .png, .jpeg, .gif"
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              type="image"
            />
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Update Guru"}
        </Button>
      </form>
    </div>
  );
};

export default EditListGuru;
