"use client";
import { usePathname } from "next/navigation";
import styles from "./Listsiswa.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionMenu from "./ActionMenu";
import { useEffect, useRef, useState } from "react";
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
  const ellipsisButtonRefs = useRef<{ [key: string]: SVGSVGElement | null }>(
    {}
  );

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

  const performSearch = () => {
    if (search !== "") {
      fetchPageData(1);
    } else {
      setSiswaData(siswa);
    }
  };

  const debounceSearch = debounce(performSearch, SEARCH_DELAY);

  useEffect(() => {
    debounceSearch();
  }, [search]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setActionMenu(null);
      fetchPageData(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setActionMenu(null);
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
                      ref={(el) => {
                        ellipsisButtonRefs.current[siswa.nisn] =
                          el as SVGSVGElement;
                        return;
                      }}
                    />
                    {actionMenu?.nisn === siswa.nisn && (
                      <ActionMenu
                        setActionMenu={setActionMenu}
                        actionMenu={actionMenu}
                        setSiswaData={setSiswaData}
                        setCurrentPage={setCurrentPage}
                        fetchPageData={fetchPageData}
                        currentPage={currentPage}
                        ellipsisButtonRef={{
                          current: ellipsisButtonRefs.current[siswa.nisn],
                        }}
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
            {totalPages > 0 ? currentPage : 0} of {totalPages}
          </span>

          <Button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
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
