"use client";
import { usePathname } from "next/navigation";
import styles from "./Listsiswa.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionMenu from "./ActionMenu";
import { useEffect, useState } from "react";
import { Siswa } from "@/types/siswa.type";
import dataSiswaServices from "@/services/dataSiswa";
import useDebounce from "@/hooks/useDebounce";
import Button from "@/components/ui/Button";

type PropTypes = {
  siswa: Siswa[];
  total: number;
};

const SEARCH_DELAY = 1000; // Delay untuk debounce

const ListSiswaView = ({ siswa, total }: PropTypes) => {
  const { debounce } = useDebounce();
  const [siswaData, setSiswaData] = useState<Siswa[]>([]);
  const [actionMenu, setActionMenu] = useState<Siswa | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const totalPages = Math.ceil(total / pageSize);
  const pathname = usePathname();

  const handleActionMenu = (selectedSiswa: Siswa) => {
    if (actionMenu?.nisn === selectedSiswa.nisn) {
      setActionMenu(null);
    } else {
      setActionMenu(selectedSiswa);
    }
  };

  const fetchPageData = async (page: number) => {
    const { data } = await dataSiswaServices.getAllSiswa({ page, search });
    setSiswaData(data.data);
    setCurrentPage(page);
  };

  // Fungsi untuk memulai pencarian
  const performSearch = () => {
    if (search !== "") {
      fetchPageData(1); // Reset ke halaman pertama setiap kali melakukan pencarian
    } else {
      setSiswaData(siswa); // Jika pencarian kosong, tampilkan data awal
    }
  };

  // Debounce pencarian
  const debounceSearch = debounce(performSearch, SEARCH_DELAY);

  // Trigger debounce ketika nilai search berubah
  useEffect(() => {
    debounceSearch();
  }, [search]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchPageData(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchPageData(currentPage - 1);
    }
  };

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
            onChange={(e) => setSearch(e.target.value)}
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
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
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
        <div className={styles.listsiswa_pagination}>
          <Button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={styles.listsiswa_pagination_prev}
          >
            Prev
          </Button>
          <span>
            {currentPage} of {totalPages}
          </span>

          <Button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={styles.listsiswa_pagination_prev}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default ListSiswaView;
