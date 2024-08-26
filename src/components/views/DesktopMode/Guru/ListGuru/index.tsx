"use client";
import styles from "./Listguru.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionMenu from "./ActionMenu";
import { useEffect, useState, useRef } from "react";
import useDebounce from "@/hooks/useDebounce";
import Button from "@/components/ui/Button";
import { Guru } from "@/types/guru.types";
import dataGuruServices from "@/services/dataGuru";

type PropTypes = {
  guru: Guru[];
  total: number;
};

const SEARCH_DELAY = 1000; // Delay untuk debounce

const ListGuruView = ({ guru, total }: PropTypes) => {
  const { debounce } = useDebounce();
  const [guruData, setGuruData] = useState<Guru[]>([]);
  const [actionMenu, setActionMenu] = useState<Guru | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const totalPages = Math.ceil(total / pageSize);
  // Type the refs to SVG elements
  const ellipsisButtonRefs = useRef<{ [key: string]: SVGSVGElement | null }>(
    {}
  );

  const handleActionMenu: (selectedGuru: Guru) => void = (
    selectedGuru: Guru
  ) => {
    if (actionMenu?.nip === selectedGuru.nip) {
      setActionMenu(null);
    } else {
      setActionMenu(selectedGuru); // Open menu for new selection
    }
  };

  const fetchPageData = async (page: number) => {
    const { data } = await dataGuruServices.getAllGuru({ page, search });
    setGuruData(data.data);
    setCurrentPage(page);
  };

  const performSearch = () => {
    if (search !== "") {
      fetchPageData(1);
    } else {
      setGuruData(guru);
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
      <div className={styles.listguru}>
        <div className={styles.listguru_search}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Cari nama siswa"
            className={styles.listguru_search_input}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table className={styles.listguru_table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NIP</th>
              <th>No HP</th>
              <th>Alamat</th>
              <th>Mapel</th>
              <th></th>
            </tr>
          </thead>
          <tbody className={styles.listguru_table_body}>
            {guruData.length > 0 ? (
              guruData.map((guru: Guru, index: number) => (
                <tr key={guru.nip}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{guru.nama}</td>
                  <td>{guru.nip}</td>
                  <td>{guru.no_hp}</td>
                  <td>{guru.alamat}</td>
                  <td>{guru.mapel}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={["fas", "ellipsis"]}
                      className={styles.listguru_table_body_icon}
                      onClick={() => handleActionMenu(guru)}
                      ref={(el) => {
                        ellipsisButtonRefs.current[guru.nip] =
                          el as SVGSVGElement;
                        return;
                      }}
                    />
                    {actionMenu?.nip === guru.nip && (
                      <ActionMenu
                        setActionMenu={setActionMenu}
                        actionMenu={actionMenu}
                        setGuruData={setGuruData}
                        setCurrentPage={setCurrentPage}
                        fetchPageData={fetchPageData}
                        currentPage={currentPage}
                        ellipsisButtonRef={{
                          current: ellipsisButtonRefs.current[guru.nip],
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className={styles.listguru_table_body_empty}>
                  Data Kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={styles.listguru_pagination}>
          <Button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={styles.listguru_pagination_prev}
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
            className={styles.listguru_pagination_prev}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default ListGuruView;
