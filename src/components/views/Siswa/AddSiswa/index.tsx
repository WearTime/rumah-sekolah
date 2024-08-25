"use client";
import React, { useState, useEffect, FormEvent } from "react";
import styles from "./AddSiswa.module.scss";
import siswaSchema from "@/validation/siswaSchema.validation";
import dataSiswaServices from "@/services/dataSiswa";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import InputFile from "@/components/ui/InputFile";
import Image from "next/image";
import { Siswa } from "@/types/siswa.type";
import Modal from "@/components/ui/Modal";
import ExcelImportSiswa from "./ExcelImportSIswa";
import { AxiosError } from "axios";

const AddSiswaView = () => {
  const [jurusan, setJurusan] = useState("");
  const [kelas, setKelas] = useState("");
  const [subJurOptions, setSubJurOptions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [modalExcelImport, setModalExcelImport] = useState<boolean>(false);

  useEffect(() => {
    let options: number[] = [];
    if (jurusan === "AKL") {
      options = [1, 2, 3, 4, 5];
    } else if (jurusan === "PPLG") {
      options = [1, 2];
    } else if (jurusan === "TJKT") {
      options = [1, 2, 3];
    } else if (jurusan === "DKV") {
      options = [1, 2];
    } else if (jurusan === "ULW") {
      options = [1, 2];
    } else if (jurusan === "BDP") {
      options = [1, 2, 3];
    } else if (jurusan === "TABUS") {
      options = [1, 2];
    } else if (jurusan === "KULINER") {
      options = [1, 2];
    } else if (jurusan === "PHT") {
      options = [1, 2, 3];
    } else if (jurusan === "MPLB") {
      if (kelas === "X") {
        options = [1, 2];
      } else if (kelas === "XI") {
        options = [1];
      }
    }
    setSubJurOptions(options);
  }, [jurusan, kelas]);

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

    // Validate and submit form
    const check = siswaSchema.safeParse(data);
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
      const result = await dataSiswaServices.addNewSiswa(formData);

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
    <>
      <div className={styles.addsiswa}>
        <div className={styles.addsiswa_main}>
          <div className={styles.addsiswa_main_header}>
            <h1>Formulir Tambah Siswa</h1>
          </div>
          <div className={styles.addsiswa_main_content}>
            <form
              onSubmit={handleSubmit}
              className={styles.addsiswa_main_content_form}
              encType="multipart/form-data"
            >
              <Input
                label="Nama"
                type="text"
                name="nama"
                placeholder="Masukan Nama Siswa"
                className={styles.addsiswa_main_content_form_input}
              />
              <Input
                label="NISN"
                type="text"
                name="nisn"
                placeholder="Masukan Nisn Siswa"
                className={styles.addsiswa_main_content_form_input}
              />
              <Input
                label="NIS"
                type="text"
                name="nis"
                placeholder="Masukan Nis Siswa"
                className={styles.addsiswa_main_content_form_input}
              />
              <div className={styles.addsiswa_main_content_form_item}>
                <label htmlFor="kelas">Kelas</label>
                <select
                  name="kelas"
                  id="kelas"
                  required
                  onChange={(e) => setKelas(e.target.value)}
                >
                  <option value="">Pilih Kelas</option>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </div>
              <div className={styles.addsiswa_main_content_form_group}>
                <div className={styles.addsiswa_main_content_form_group_item}>
                  <label htmlFor="jurusan">Jurusan</label>
                  <select
                    name="jurusan"
                    id="jurusan"
                    disabled={!kelas}
                    onChange={(e) => setJurusan(e.target.value)}
                  >
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
                <div className={styles.addsiswa_main_content_form_group_item}>
                  <label htmlFor="sub_jur">Nomor Jurusan</label>
                  <select name="sub_jur" id="sub_jur" disabled={!jurusan}>
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
                placeholder="Masukan Nomor Handphone Siswa"
                className={styles.addsiswa_main_content_form_input}
              />
              <div className={styles.addsiswa_main_content_form_item}>
                <label htmlFor="alamat">Alamat</label>
                <textarea
                  name="alamat"
                  id="alamat"
                  cols={20}
                  rows={2}
                  required
                />
              </div>

              <div className={styles.addsiswa_main_content_form_item}>
                <div className={styles.addsiswa_main_content_form_item_image}>
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
              <div className={styles.addsiswa_main_content_form_button}>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Tambah Siswa"}
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
          <ExcelImportSiswa setModalExcelImport={setModalExcelImport} />
        </Modal>
      )}
    </>
  );
};

export default AddSiswaView;
