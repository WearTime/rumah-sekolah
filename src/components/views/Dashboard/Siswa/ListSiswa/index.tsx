"use client";
import { usePathname } from "next/navigation";
import styles from "./Listsiswa.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionMenu from "./ActionMenu";
import { useEffect, useState } from "react";
import { Siswa } from "@/types/siswa.type";

type PropTypes = {
  siswa: Siswa[]; // Expecting an array of Siswa objects
};

const ListSiswaView = ({ siswa }: PropTypes) => {
  const [siswaData, setSiswaData] = useState<Siswa[]>([]);
  const [actionMenu, setActionMenu] = useState<Siswa | null>(null);
  const pathname = usePathname();

  const handleActionMenu = (selectedSiswa: Siswa) => {
    if (actionMenu?.nisn === selectedSiswa.nisn) {
      setActionMenu(null); // Close the action menu if it's already open for the clicked user
    } else {
      setActionMenu(selectedSiswa); // Open the action menu for the selected user
    }
  };

  useEffect(() => {
    setSiswaData(siswa);
  }, [siswa]);

  return (
    <>
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
                      onClick={() => handleActionMenu(siswa)}
                    />
                    {actionMenu?.nisn === siswa.nisn && (
                      <ActionMenu
                        actionMenu={actionMenu}
                        setActionMenu={setActionMenu}
                        setSiswaData={setSiswaData}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className={styles.listsiswa_table_body_empty}>
                  Data Kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListSiswaView;
