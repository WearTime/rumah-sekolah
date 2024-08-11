"use client";
import { usePathname } from "next/navigation";
import styles from "./Listsiswa.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionMenu from "./ActionMenu";
import { Dispatch, SetStateAction, useState } from "react";
import { Siswa } from "@/types/siswa.type";

type PropTypes = {
  siswaData: Siswa[]; // Expecting an array of Siswa objects
};

const ListSiswaView = ({ siswaData }: PropTypes) => {
  const [toggleActionMenu, setToggleActionMenu] = useState(false);
  const pathname = usePathname();

  return (
    <div className={styles.listsiswa}>
      <div className={styles.listsiswa_search}>

        <input
          type="text"
          name="search"
          id="search"
          placeholder="Cari nama siswa"
          className={styles.listsiswa_search_input}
        />
      </div>
      <table className={styles.listsiswa_table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>NISN</th>
            <th>NIP</th>
            <th>Kelas</th>
            <th>Jurusan</th>
            <th>No HP</th>
            <th>Alamat</th>
            <th></th>
          </tr>
        </thead>
        <tbody className={styles.listsiswa_table_body}>
          {siswaData.length > 0 ? (
            siswaData.map((siswa: Siswa, index) => (
              <tr key={siswa.nisn}>
                <td>{index + 1}</td>
                <td>{siswa.nama}</td>
                <td>{siswa.nisn}</td>
                <td>{siswa.nis}</td>
                <td>{siswa.kelas}</td>
                <td>{siswa.jurusan}</td>
                <td>{siswa.no_hp}</td>
                <td>{siswa.alamat}</td>
                <td>
                  <FontAwesomeIcon
                    icon={["fas", "ellipsis"]}
                    className={styles.listsiswa_table_body_icon}
                    onClick={() => setToggleActionMenu(!toggleActionMenu)}
                  />
                  <ActionMenu
                    setToggleActionMenu={setToggleActionMenu}
                    toggleActionMenu={toggleActionMenu}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>Data Kosong</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListSiswaView;
