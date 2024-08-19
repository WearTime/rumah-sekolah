import { Siswa } from "@/types/siswa.type";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styles from "./EditListSiswa.module.scss";
import Button from "@/components/ui/Button";
import dataSiswaServices from "@/services/dataSiswa";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import siswaSchema from "@/validation/siswaSchema.validation";
import Image from "next/image";
import InputFile from "@/components/ui/InputFile";
import { AxiosError } from "axios";

type PropTypes = {
  setActionMenu: Dispatch<SetStateAction<Siswa | null>>;
  editSiswa: Siswa | null;
  setSiswaData: Dispatch<SetStateAction<Siswa[]>>;
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

const EditListSiswa = ({
  setActionMenu,
  editSiswa,
  setSiswaData,
  setIsModalOpen,
  currentPage,
  fetchPageData,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jurusan, setJurusan] = useState(
    editSiswa?.jurusan.split(" ")[0] || ""
  );
  const [kelas, setKelas] = useState(editSiswa?.kelas || "");
  const [subJurOptions, setSubJurOptions] = useState<number[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const sub_jur = editSiswa?.jurusan.split(" ")[1] || "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    const data: Siswa = {
      nama: form.nama.value,
      nisn: form.nisn.value,
      nis: form.nis.value,
      kelas: form.kelas.value,
      jurusan: form.jurusan.value + " " + form.sub_jur.value,
      no_hp: form.no_hp.value,
      alamat: form.alamat.value,
    };
    const check = siswaSchema.safeParse(data);

    if (!check.success) {
      toast.error(check.error.errors[0].message);

      setIsLoading(false);
      return;
    }

    if (!editSiswa?.nisn) {
      toast.error("NISN is missing");
      setIsLoading(false);
      return;
    }

    formData.append("data", JSON.stringify(data));
    if (form.image.files[0]) {
      formData.append("image", form.image.files[0]);
    }

    try {
      const result = await dataSiswaServices.editDataSiswa(
        editSiswa.nisn,
        formData
      );

      if (result.status == 200) {
        setIsModalOpen({
          deleteModal: false,
          editModal: false,
          detailModal: false,
        });
        toast.success("Berhasil Update Data");
        const { data } = await dataSiswaServices.getAllSiswa({
          page: currentPage,
          search: "",
        });
        setSiswaData(data.data);
        fetchPageData(currentPage);
      } else {
        setIsModalOpen({
          deleteModal: false,
          editModal: false,
          detailModal: false,
        });
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
      setActionMenu(null);
    }
  };

  useEffect(() => {
    let options: number[] = [];
    if (jurusan === "AKL") {
      options = [1, 2, 3, 4, 5];
    } else if (jurusan === "PPLG") {
      options = [1, 2];
    } else if (jurusan === "MPLB") {
      if (kelas === "X") {
        options = [1, 2];
      } else if (kelas === "XI") {
        options = [1, 2, 3];
      }
    }
    setSubJurOptions(options);
  }, [jurusan, kelas]);

  return (
    <div className={styles.modal}>
      <h1>Update Siswa</h1>
      <form className={styles.modal_form} onSubmit={handleSubmit}>
        <Input
          label="Nama"
          type="text"
          name="nama"
          defaultValue={editSiswa?.nama}
          className={styles.modal_form_input}
        />
        <Input
          label="NISN"
          type="text"
          name="nisn"
          defaultValue={editSiswa?.nisn}
          className={styles.modal_form_input}
        />
        <Input
          label="NIS"
          type="number"
          name="nis"
          defaultValue={editSiswa?.nis}
          className={styles.modal_form_input}
        />

        <div className={styles.modal_form_group}>
          <div className={styles.modal_form_group_item}>
            <label htmlFor="kelas">Kelas</label>
            <select
              name="kelas"
              id="kelas"
              required
              onChange={(e) => setKelas(e.target.value)}
              value={kelas}
            >
              <option value="">Pilih Kelas</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>
          </div>
        </div>
        <div className={styles.modal_form_group}>
          <div className={styles.modal_form_group_item}>
            <label htmlFor="jurusan">Jurusan</label>
            <select
              name="jurusan"
              id="jurusan"
              disabled={!kelas}
              onChange={(e) => setJurusan(e.target.value)}
              value={jurusan}
            >
              <option value="">Pilih Jurusan</option>
              <option value="AKL">AKL</option>
              <option value="PPLG">PPLG</option>
              <option value="TKJ">TKJ</option>
              <option value="DKV">DKV</option>
              <option value="MPLB">MPLB</option>
              <option value="BDP">BDP</option>
              <option value="KULINER">KULINER</option>
              <option value="TATABUSANA">TATA BUSANA</option>
              <option value="PHT">PHT</option>
              <option value="UPW">UPW</option>
            </select>
          </div>
          <div className={styles.modal_form_group_item}>
            <label htmlFor="sub_jur">Nomor Jurusan</label>
            <select
              name="sub_jur"
              id="sub_jur"
              disabled={!jurusan}
              value={sub_jur}
            >
              <option value="">Pilih Nomor Jurusan</option>
              {subJurOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Input
          label="No HP"
          type="text"
          name="no_hp"
          defaultValue={editSiswa?.no_hp}
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
              defaultValue={editSiswa?.alamat}
            />
          </div>
        </div>
        <div className={styles.modal_form_group_item}>
          <div className={styles.modal_form_group_item_image}>
            {editSiswa?.image ? (
              <Image
                width={100}
                height={100}
                src={
                  uploadedImage
                    ? URL.createObjectURL(uploadedImage)
                    : `http://localhost:3000${editSiswa?.image}`
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
          {isLoading ? "Loading..." : "Update Siswa"}
        </Button>
      </form>
    </div>
  );
};

export default EditListSiswa;
