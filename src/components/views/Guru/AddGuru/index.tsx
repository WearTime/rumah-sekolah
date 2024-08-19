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

const AddGuruView = () => {
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
  };

  return (
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
            <Input
              label="MAPEL"
              type="text"
              name="mapel"
              placeholder="Masukan Mapel Siswa"
              className={styles.addguru_main_content_form_input}
            />
            <Input
              label="No HP"
              type="text"
              name="no_hp"
              placeholder="Masukan Nomor Handphone Siswa"
              className={styles.addguru_main_content_form_input}
            />
            <div className={styles.addguru_main_content_form_item}>
              <label htmlFor="alamat">Alamat</label>
              <textarea name="alamat" id="alamat" cols={20} rows={2} required />
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGuruView;
