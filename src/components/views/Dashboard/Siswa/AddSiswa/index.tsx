"use client";
import React, { useState, useEffect, FormEvent } from "react";
import styles from "./AddSiswa.module.scss";
import siswaSchema from "@/validation/siswaSchema.validation";
import dataSiswaServices from "@/services/dataSiswa";

const AddSiswaView = () => {
  const [jurusan, setJurusan] = useState("");
  const [kelas, setKelas] = useState("");
  const [subJurOptions, setSubJurOptions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ success: string; errors: string }>(
    { success: "", errors: "" }
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;

    // Extracting form values
    const data = {
      nama: form.nama.value,
      nisn: form.nisn.value,
      nis: form.nis.value,
      kelas: form.kelas.value,
      jurusan: form.jurusan.value + " " + form.sub_jur.value,
      no_hp: form.no_hp.value,
      alamat: form.alamat.value,
    };

    // Validate the data using Zod
    const check = siswaSchema.safeParse(data);

    if (!check.success) {
      console.log(check.error.errors);

      setMessages({ success: "", errors: check.error.errors[0].message });
      setIsLoading(false);
      return;
    }

    setMessages({ success: "Successfully added siswa", errors: "" });
    const result = await dataSiswaServices.addNewSiswa(data);
    form.reset();
    setKelas("");
    setJurusan("");
    setIsLoading(false);
    setMessages({ success: "", errors: "" });
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
    <div className={styles.addsiswa}>
      <div className={styles.addsiswa_main}>
        <div className={styles.addsiswa_main_header}>
          <h1>Formulir Tambah Siswa</h1>

          {messages.errors.length > 0 && (
            <p className={styles.addsiswa_main_header_error}>
              {messages.errors}
            </p>
          )}

          {messages.success.length > 0 && (
            <p className={styles.addsiswa_main_header_success}>
              {messages.success}
            </p>
          )}
        </div>
        <div className={styles.addsiswa_main_content}>
          <form
            onSubmit={handleSubmit}
            className={styles.addsiswa_main_content_form}
          >
            <div className={styles.addsiswa_main_content_form_item}>
              <label htmlFor="nama">Nama</label>
              <input type="text" name="nama" id="nama" required />
            </div>
            <div className={styles.addsiswa_main_content_form_group}>
              <div className={styles.addsiswa_main_content_form_group_item}>
                <label htmlFor="nisn">NISN</label>
                <input type="text" name="nisn" id="nisn" required />
              </div>
              <div className={styles.addsiswa_main_content_form_group_item}>
                <label htmlFor="nis">NIS</label>
                <input type="text" name="nis" id="nis" required />
              </div>
            </div>
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
                  <option value="TKJ">TKJ</option>
                  <option value="DKV">DKV</option>
                  <option value="MPLB">MPLB</option>
                  <option value="BDP">BDP</option>
                  <option value="KULINER">KULINER</option>
                  <option value="TATA BOGA">TATA BOGA</option>
                  <option value="UPW">UPW</option>
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
            <div className={styles.addsiswa_main_content_form_item}>
              <label htmlFor="no_hp">No HP</label>
              <input type="text" name="no_hp" id="no_hp" required />
            </div>
            <div className={styles.addsiswa_main_content_form_item}>
              <label htmlFor="alamat">Alamat</label>
              <textarea name="alamat" id="alamat" cols={20} rows={2} required />
            </div>

            <div className={styles.addsiswa_main_content_form_button}>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Tambah Siswa"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSiswaView;
