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

type PropTypes = {
  editSiswa: Siswa | null;
  setSiswaData: Dispatch<SetStateAction<Siswa[]>>;
  setIsModalOpen: Dispatch<
    SetStateAction<{
      deleteModal: boolean;
      editModal: boolean;
      detailModal: boolean;
    }>
  >;
};

const EditListSiswa = ({
  editSiswa,
  setSiswaData,
  setIsModalOpen,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jurusan, setJurusan] = useState(
    editSiswa?.jurusan.split(" ")[0] || ""
  );
  const [kelas, setKelas] = useState(editSiswa?.kelas || "");
  const [subJurOptions, setSubJurOptions] = useState<number[]>([]);

  const sub_jur = editSiswa?.jurusan.split(" ")[1] || "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;

    const data = {
      nama: form.nama.value,
      nisn: form.nisn.value,
      nis: form.nis.value,
      kelas: form.kelas.value,
      jurusan: form.jurusan.value + " " + form.sub_jur.value,
      no_hp: form.no_hp.value,
      alamat: form.alamat.value,
    };

    console.log(data);

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

    const result = await dataSiswaServices.editDataSiswa(editSiswa.nisn, data);

    if (result.status == 200) {
      setIsModalOpen({
        deleteModal: false,
        editModal: false,
        detailModal: false,
      });
      setIsLoading(false);
      toast.success("Berhasil Update Data");
      const { data } = await dataSiswaServices.getAllSiswa();
      setSiswaData(data.data);
    } else {
      setIsModalOpen({
        deleteModal: false,
        editModal: false,
        detailModal: false,
      });
      setIsLoading(false);
      toast.error("Something went wrong!");
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
              <option value="TATA BOGA">TATA BOGA</option>
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Update Siswa"}
        </Button>
      </form>
    </div>
  );
};

export default EditListSiswa;
