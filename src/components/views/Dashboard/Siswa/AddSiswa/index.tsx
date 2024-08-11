"use client";
import React, { useState, useEffect } from "react";
import styles from "./AddSiswa.module.scss";

const AddSiswaView = () => {
  const [jurusan, setJurusan] = useState("");
  const [kelas, setKelas] = useState("");
  const [subJurOptions, setSubJurOptions] = useState([]);

  useEffect(() => {
    let options: any = [];
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
          <h1>Folmulir Tambah Siswa</h1>
        </div>
        <div className={styles.addsiswa_main_content}>
          <form action="" className={styles.addsiswa_main_content_form}>
            <div className={styles.addsiswa_main_content_form_item}>
              <label htmlFor="nama">Nama</label>
              <input type="text" name="nama" id="nama" required />
            </div>
            <div className={styles.addsiswa_main_content_form_group}>
              <div className={styles.addsiswa_main_content_form_group_item}>
                <label htmlFor="nisn">Nisn</label>
                <input type="text" name="nisn" id="nisn" required />
              </div>
              <div className={styles.addsiswa_main_content_form_group_item}>
                <label htmlFor="nis">Nis</label>
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
                <option value="none">None</option>
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
                  onChange={(e) => setJurusan(e.target.value)}
                >
                  <option value="none">None</option>
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
                <select name="sub_jur" id="sub_jur">
                  {subJurOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.addsiswa_main_content_form_item}>
              <label htmlFor="nohp">No HP</label>
              <input type="text" name="nohp" id="nohp" required />
            </div>
            <div className={styles.addsiswa_main_content_form_item}>
              <label htmlFor="alamat">Alamat</label>
              <textarea name="alamat" id="alamat" cols={20} rows={2} required />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSiswaView;
