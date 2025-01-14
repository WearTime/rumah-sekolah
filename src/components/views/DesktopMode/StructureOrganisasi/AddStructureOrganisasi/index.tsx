"use client";
import styles from "./AddStructureOrganisasi.module.scss";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useDebounce from "@/hooks/useDebounce";
import dataGuruServices from "@/services/dataGuru";
import dataStructureOrganisasiServices from "@/services/dataStructureOrganisasi";
import { Guru } from "@/types/guru.types";
import { StructureOrganisasi } from "@/types/structureorganisasi.type";
import { StructureOrganisasiSchema } from "@/validation/guruSchema.validation";
import { AxiosError } from "axios";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const AddStructureOrganisasiView = () => {
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

    const data: StructureOrganisasi = {
      jabatan: form.jabatan.value,
      nip: selectedGuruId,
    };

    const check = StructureOrganisasiSchema.safeParse(data);
    if (!check.success) {
      toast.error(check.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    formData.append("data", JSON.stringify(data));
    formData.append("guru_nip", selectedGuruId);
    try {
      const result = await dataStructureOrganisasiServices.addNewStrOrg(
        formData
      );
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
    <div className={styles.addStrOrg}>
      <div className={styles.addStrOrg_main}>
        <div className={styles.addStrOrg_main_header}>
          <h1>Formulir Tambah Mapel</h1>
        </div>
        <div className={styles.addStrOrg_main_content}>
          <form
            onSubmit={handleSubmit}
            className={styles.addStrOrg_main_content_form}
            encType="multipart/form-data"
          >
            <Input
              label="Jabatan"
              type="text"
              name="jabatan"
              placeholder="Masukan Jabatan Mapel"
              className={styles.addStrOrg_main_content_form_input}
            />
            <div className={styles.addStrOrg_main_content_form_item}>
              <label htmlFor="guru">Pengajar</label>
              <input
                list="gurus"
                name="guru"
                id="guru"
                placeholder="Silahkan isi atau pilih Pengajar"
                className={styles.addStrOrg_main_content_form_item_datalist}
                onChange={(e) => {
                  handleGuruNameChange(e.target.value);
                  updateSelectedGuruId(e.target.value);
                }}
                value={guruName}
              />
              <datalist id="gurus">{guruOptions}</datalist>
            </div>
            <div className={styles.addStrOrg_main_content_form_button}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Tambah Structure Organisasi"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStructureOrganisasiView;
