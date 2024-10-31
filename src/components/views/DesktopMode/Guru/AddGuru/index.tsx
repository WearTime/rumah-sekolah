"use client";
import React, { useState, useEffect, FormEvent } from "react";
import styles from "./AddGuru.module.scss";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import InputFile from "@/components/ui/InputFile";
import Image from "next/image";
import { Guru } from "@/types/guru.types";
import guruSchema from "@/validation/guruSchema.validation";
import dataGuruServices from "@/services/dataGuru";
import { AxiosError } from "axios";
import ExcelImportGuru from "./ExcelImportGuru";
import Modal from "@/components/ui/Modal";
import dataMapelServices from "@/services/dataMapel";

type Mapel = {
  kode_mapel: string;
  nama_mapel: string;
};

const AddGuruView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [modalExcelImport, setModalExcelImport] = useState<boolean>(false);
  const [mapelList, setMapelList] = useState<Mapel[]>([]);

  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const mapel = await dataMapelServices.getAllMapel({ page: 1 });
        setMapelList(mapel.data.data); // Set the fetched data
      } catch (error) {
        toast.error("Failed to fetch mapel data");
      }
    };
    fetchMapel();
  }, []);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    const data: Guru = {
      nama: form.nama.value,
      nip: form.nip.value,
      mapel_id: form.mapel.value,
      no_hp: form.no_hp.value,
      alamat: form.alamat.value,
    };

    // Validate and submit form
    const check = guruSchema.safeParse(data);
    if (!check.success) {
      toast.error(check.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    // Handle Image Upload
    formData.append("data", JSON.stringify(data));
    if (form.image.files[0]) {
      formData.append("image", form.image.files[0]);
    }

    try {
      const result = await dataGuruServices.addNewGuru(formData);

      if (result.status == 201) {
        form.reset();
        setUploadedImage(null);
        setIsLoading(false);
        toast.success("Berhasil Tambah Data");
      } else {
        setIsLoading(false);
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

  return (
    <>
      <div className={styles.addguru}>
        <div className={styles.addguru_main}>
          <div className={styles.addguru_main_header}>
            <h1>Formulir Tambah Guru</h1>
          </div>
          <div className={styles.addguru_main_content}>
            <form
              onSubmit={handleSubmit}
              className={styles.addguru_main_content_form}
              encType="multipart/form-data"
            >
              <Input
                label="Nama"
                type="text"
                name="nama"
                placeholder="Masukan Nama Siswa"
                className={styles.addguru_main_content_form_input}
              />
              <Input
                label="NIP"
                type="text"
                name="nip"
                placeholder="Masukan Nip Siswa"
                className={styles.addguru_main_content_form_input}
              />
              {/* <Input
                label="MAPEL"
                type="text"
                name="mapel"
                placeholder="Masukan Mapel Siswa"
                className={styles.addguru_main_content_form_input}
              /> */}
              <div className={styles.addguru_main_content_form_group}>
                <div className={styles.addguru_main_content_form_group_item}>
                  <label htmlFor="mapel">Mapel</label>
                  <select name="mapel" id="mapel">
                    <option value="">Pilih Mapel</option>
                    {mapelList.map((mapel) => (
                      <option key={mapel.kode_mapel} value={mapel.kode_mapel}>
                        {mapel.nama_mapel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Input
                label="No HP"
                type="text"
                name="no_hp"
                placeholder="Masukan Nomor Handphone Siswa"
                className={styles.addguru_main_content_form_input}
              />
              <div className={styles.addguru_main_content_form_item}>
                <label htmlFor="alamat">Alamat</label>
                <textarea
                  name="alamat"
                  id="alamat"
                  cols={20}
                  rows={2}
                  required
                />
              </div>

              <div className={styles.addguru_main_content_form_item}>
                <div className={styles.addguru_main_content_form_item_image}>
                  {uploadedImage ? (
                    <Image
                      width={200}
                      height={200}
                      src={URL.createObjectURL(uploadedImage)}
                      alt="image"
                      className={styles.form__image__preview}
                    />
                  ) : (
                    <div className={styles.form__image__placeholder}>
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
              <div className={styles.addguru_main_content_form_button}>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Tambah Guru"}
                </Button>
                <Button type="button" onClick={() => setModalExcelImport(true)}>
                  Import From Excel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {modalExcelImport && (
        <Modal onClose={() => setModalExcelImport(false)}>
          <ExcelImportGuru setModalExcelImport={setModalExcelImport} />
        </Modal>
      )}
    </>
  );
};

export default AddGuruView;
