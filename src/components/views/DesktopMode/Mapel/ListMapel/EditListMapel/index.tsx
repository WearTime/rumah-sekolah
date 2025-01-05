import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "./EditListMapel.module.scss";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import { Mapel } from "@/types/mapel.type";
import mapelSchema from "@/validation/mapelSchema.validation";
import dataMapelServices from "@/services/dataMapel";
import { AxiosError } from "axios";
import { Guru } from "@/types/guru.types";
import dataGuruServices from "@/services/dataGuru";
import useDebounce from "@/hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PropTypes = {
  setActionMenu: Dispatch<SetStateAction<Mapel | null>>;
  editMapel: Mapel | null;
  setMapelData: Dispatch<SetStateAction<Mapel[]>>;
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

const EditListMapel = ({
  setActionMenu,
  editMapel,
  setMapelData,
  setIsModalOpen,
  currentPage,
  fetchPageData,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);
  const [guruData, setGuruData] = useState<Guru[]>([]);
  const [selectedGurus, setSelectedGurus] = useState<Guru[]>(
    editMapel?.guruandmapel?.map((item) => item.guru) || []
  );
  const [page, setPage] = useState(1);
  const [guruName, setGuruName] = useState("");
  const [inputGuruNames, setInputGuruNames] = useState<string[]>(
    selectedGurus.map((guru) => guru.nama || "")
  );

  const { debounce } = useDebounce();

  const fetchGuruData = useCallback(
    debounce(async (search: string, page: number) => {
      try {
        const { data } = await dataGuruServices.getAllGuru({ search, page });

        setGuruData((prev) =>
          page === 1 ? data.data : [...prev, ...data.data]
        );

        // Jika hasil pencarian habis di halaman terakhir, berhenti
        if (data.data.length === 0) return;
      } catch (error) {
        toast.error("Gagal memuat data guru");
        console.error("Error fetching guru data:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchGuruData(guruName, page);
  }, [guruName, page, fetchGuruData]);

  const handleLoadMoreGuru = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleGuruChange = (value: string, index: number) => {
    const selectedGuru = guruData.find((guru) => guru.nama === value);
    const updatedGurus = [...selectedGurus];
    const updatedInputNames = [...inputGuruNames];

    if (selectedGuru) {
      // Update guru dan reset nama input pada index tersebut
      updatedGurus[index] = selectedGuru;
      updatedInputNames[index] = selectedGuru.nama;
    } else {
      // Simpan nilai input sementara
      updatedInputNames[index] = value;
    }

    setSelectedGurus(updatedGurus);
    setInputGuruNames(updatedInputNames);
    setGuruName(value); // Ini akan memicu pencarian datalist otomatis
  };
  const handleAddGuru = () => {
    setSelectedGurus([...selectedGurus, {} as Guru]);
  };

  const handleDeleteGuru = (index: number) => {
    const updatedGurus = selectedGurus.filter((_, i) => i !== index);
    setSelectedGurus(updatedGurus);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    const isAnyGuruEmpty = selectedGurus.some(
      (guru) => !guru.nama || guru.nama.trim() === ""
    );
    if (isAnyGuruEmpty) {
      toast.error("Semua input guru harus diisi.");
      setIsLoading(false);
      return;
    }

    const data: Mapel = {
      kode_mapel: form.kode_mapel.value,
      nama_mapel: form.nama_mapel.value,
      tipe_mapel: form.tipe_mapel.value,
      fase: form.fase.value,
      jurusan: form.jurusan.value,
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
    formData.append(
      "gurus_nip",
      JSON.stringify(selectedGurus.map((guru) => guru.nip))
    );

    try {
      const result = await dataMapelServices.editDataMapel(
        editMapel.kode_mapel,
        formData
      );

      if (result.status == 200) {
        toast.success("Berhasil Update Data");
        const { data } = await dataMapelServices.getAllMapel({
          page: currentPage,
          search: "",
        });
        setMapelData(data.data);
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

        <div className={styles.modal_form_group}>
          <div className={styles.modal_form_group_item}>
            <label htmlFor="jurusan">Jurusan</label>
            <select name="jurusan" id="jurusan" value={editMapel?.jurusan}>
              <option value="">Pilih Jurusan</option>
              <option value="AKL">AKL</option>
              <option value="PPLG">PPLG</option>
              <option value="TJKT">TJKT</option>
              <option value="DKV">DKV</option>
              <option value="MPLB">MPLB</option>
              <option value="BDP">BDP</option>
              <option value="KULINER">KULINER</option>
              <option value="TABUS">TATA BUSANA</option>
              <option value="PHT">PHT</option>
              <option value="ULW">ULW</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="guru">Pengajar</label>
          {selectedGurus.map((guru, index) => (
            <div className={styles.modal_form_group} key={index}>
              <div className={styles.modal_form_group_dataGuru}>
                <input
                  list={`gurus-${index}`}
                  value={inputGuruNames[index] || ""}
                  onChange={(e) => handleGuruChange(e.target.value, index)}
                  placeholder="Pilih atau cari Pengajar"
                  className={styles.addmapel_main_content_form_item_datalist}
                  required
                />

                <Button
                  className={styles.modal_form_group_dataGuru_dataClsBtn}
                  type="button"
                  onClick={() => handleDeleteGuru(index)}
                >
                  <FontAwesomeIcon
                    icon={["fas", "xmark"]}
                    className={styles.modal_form_group_item_content_btn_xmark}
                  />
                </Button>
              </div>
              <datalist id={`gurus-${index}`}>
                {guruData
                  .filter(
                    (guru) =>
                      !selectedGurus.some(
                        (selected) => selected.nip === guru.nip
                      )
                  )
                  .map((guru) => (
                    <option key={guru.nip} value={guru.nama} />
                  ))}
              </datalist>
            </div>
          ))}
        </div>

        <Button type="button" onClick={handleAddGuru}>
          Add Guru
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Update Siswa"}
        </Button>
      </form>
    </div>
  );
};

export default EditListMapel;
