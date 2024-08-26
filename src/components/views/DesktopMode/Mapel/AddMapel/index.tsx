"use client";
import React, { useState, useEffect, FormEvent } from "react";
import styles from "./AddMapel.module.scss";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mapel } from "@/types/mapel.type";
import mapelSchema from "@/validation/mapelSchema.validation";
import dataMapelServices from "@/services/dataMapel";
import { AxiosError } from "axios";
const AddMapelView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

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

    // Validate and submit form
    const check = mapelSchema.safeParse(data);
    if (!check.success) {
      toast.error(check.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    // Handle Image Upload
    formData.append("data", JSON.stringify(data));

    try {
      const result = await dataMapelServices.addNewMapel(formData);

      if (result.status == 201) {
        form.reset();
        setUploadedImage(null);
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

  return (
    <div className={styles.addsiswa}>
      <div className={styles.addsiswa_main}>
        <div className={styles.addsiswa_main_header}>
          <h1>Formulir Tambah Mapel</h1>
        </div>
        <div className={styles.addsiswa_main_content}>
          <form
            onSubmit={handleSubmit}
            className={styles.addsiswa_main_content_form}
            encType="multipart/form-data"
          >
            <Input
              label="Kode Mapel"
              type="text"
              name="kode_mapel"
              placeholder="Masukan Kode Mapel"
              className={styles.addsiswa_main_content_form_input}
            />
            <Input
              label="Nama"
              type="text"
              name="nama_mapel"
              placeholder="Masukan Nama Mapel"
              className={styles.addsiswa_main_content_form_input}
            />
            <Input
              label="Fase"
              type="text"
              name="fase"
              placeholder="Masukan Fase Mapel"
              className={styles.addsiswa_main_content_form_input}
            />
            <div className={styles.addsiswa_main_content_form_item}>
              <label htmlFor="tipe_mapel">Tipe Mapel</label>
              <select name="tipe_mapel" id="tipe_mapel" required>
                <option value="Umum">Umum</option>
                <option value="Jurusan">Jurusan</option>
              </select>
            </div>

            <div className={styles.addsiswa_main_content_form_button}>
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
