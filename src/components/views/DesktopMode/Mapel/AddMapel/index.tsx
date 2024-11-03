"use client";
import React, {
  useState,
  useEffect,
  FormEvent,
  useCallback,
  useMemo,
} from "react";
import styles from "./AddMapel.module.scss";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mapel } from "@/types/mapel.type";
import mapelSchema from "@/validation/mapelSchema.validation";
import dataMapelServices from "@/services/dataMapel";
import { AxiosError } from "axios";
import dataGuruServices from "@/services/dataGuru";
import useDebounce from "@/hooks/useDebounce";
import { Guru } from "@/types/guru.types";

const AddMapelView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [guruData, setGuruData] = useState<Guru[]>([]);
  const [selectedGuruId, setSelectedGuruId] = useState<string | null>(null);
  const [guruName, setGuruName] = useState("");
  const [page, setPage] = useState(1);
  const { debounce } = useDebounce();

  const fetchGuruData = useCallback(
    debounce(async (search: string, page: number) => {
      try {
        const { data } = await dataGuruServices.getAllGuru({
          search,
          page,
        });

        setGuruData((prev) =>
          page === 1 ? data.data : [...prev, ...data.data]
        );
      } catch (error) {
        toast.error("Failed to fetch guru data");
        console.error("Error fetching guru data:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchGuruData(guruName, page);
  }, [guruName, page, fetchGuruData]);

  const updateSelectedGuruId = (name: string) => {
    const selectedGuru = guruData.find((guru) => guru.nama == name);
    setSelectedGuruId(selectedGuru ? selectedGuru.nip : null);
  };

  const handleGuruNameChange = (value: string) => {
    setGuruName(value);
    setPage(1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    if (selectedGuruId === null) {
      toast.error("Guru tidak ditemukan!");
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

    formData.append("data", JSON.stringify(data));
    formData.append("guru_nip", selectedGuruId);
    try {
      const result = await dataMapelServices.addNewMapel(formData);
      if (result.status === 201) {
        form.reset();
        setGuruName("");
        toast.success("Berhasil Tambah Data");
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
    }
  };

  const guruOptions = useMemo(
    () =>
      guruData.map((guru) => (
        <option key={guru.nip} value={guru.nama}></option>
      )),
    [guruData]
  );

  return (
    <div className={styles.addmapel}>
      <div className={styles.addmapel_main}>
        <div className={styles.addmapel_main_header}>
          <h1>Formulir Tambah Mapel</h1>
        </div>
        <div className={styles.addmapel_main_content}>
          <form
            onSubmit={handleSubmit}
            className={styles.addmapel_main_content_form}
            encType="multipart/form-data"
          >
            <Input
              label="Kode Mapel"
              type="text"
              name="kode_mapel"
              placeholder="Masukan Kode Mapel"
              className={styles.addmapel_main_content_form_input}
            />
            <Input
              label="Nama"
              type="text"
              name="nama_mapel"
              placeholder="Masukan Nama Mapel"
              className={styles.addmapel_main_content_form_input}
            />
            <Input
              label="Fase"
              type="text"
              name="fase"
              placeholder="Masukan Fase Mapel"
              className={styles.addmapel_main_content_form_input}
            />
            <div className={styles.addmapel_main_content_form_item}>
              <label htmlFor="guru">Pengajar</label>
              <input
                list="gurus"
                name="guru"
                id="guru"
                placeholder="Silahkan isi atau pilih Pengajar"
                className={styles.addmapel_main_content_form_item_datalist}
                onChange={(e) => {
                  handleGuruNameChange(e.target.value);
                  updateSelectedGuruId(e.target.value);
                }}
                value={guruName}
              />
              <datalist id="gurus">{guruOptions}</datalist>
            </div>
            <div className={styles.addmapel_main_content_form_item}>
              <label htmlFor="jurusan">Jurusan</label>
              <select name="jurusan" id="jurusan">
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
            <div className={styles.addmapel_main_content_form_item}>
              <label htmlFor="tipe_mapel">Tipe Mapel</label>
              <select name="tipe_mapel" id="tipe_mapel" required>
                <option value="Umum">Umum</option>
                <option value="Jurusan">Jurusan</option>
              </select>
            </div>
            <div className={styles.addmapel_main_content_form_button}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Tambah Mapel"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMapelView;
