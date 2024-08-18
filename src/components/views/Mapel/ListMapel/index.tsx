"use client";
import styles from "./Listmapel.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionMenu from "./ActionMenu";
import { useEffect, useRef, useState } from "react";
import { Siswa } from "@/types/siswa.type";
import useDebounce from "@/hooks/useDebounce";
import Button from "@/components/ui/Button";
import { Mapel } from "@/types/mapel.type";
import dataMapelServices from "@/services/dataMapel";

type PropTypes = {
  mapel: Mapel[];
  total: number;
};

const SEARCH_DELAY = 1000; // Delay untuk debounce

const ListMapelView = ({ mapel, total }: PropTypes) => {
  const { debounce } = useDebounce();
  const [mapelData, setMapelData] = useState<Mapel[]>([]);
  const [actionMenu, setActionMenu] = useState<Mapel | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const totalPages = Math.ceil(total / pageSize);
  const ellipsisButtonRefs = useRef<{ [key: string]: SVGSVGElement | null }>(
    {}
  );

  const handleActionMenu = (selectedMapel: Mapel) => {
    if (actionMenu?.kode_mapel === selectedMapel.kode_mapel) {
      setActionMenu(null);
    } else {
      setActionMenu(selectedMapel);
    }
  };

  const fetchPageData = async (page: number) => {
    const { data } = await dataMapelServices.getAllMapel({ page, search });
    setMapelData(data.data);
    setCurrentPage(page);
  };

  const performSearch = () => {
    if (search !== "") {
      fetchPageData(1);
    } else {
      setMapelData(mapel);
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
              <th>Kode</th>
              <th>Nama</th>
              <th>Fase</th>
              <th>Tipe</th>
              <th></th>
            </tr>
          </thead>
          <tbody className={styles.listsiswa_table_body}>
            {mapelData.length > 0 ? (
              mapelData.map((mapel: Mapel, index) => (
                <tr key={mapel.kode_mapel}>
                  <td>{mapel.kode_mapel}</td>
                  <td>{mapel.nama_mapel}</td>
                  <td>{mapel.fase}</td>
                  <td>{mapel.tipe_mapel}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={["fas", "ellipsis"]}
                      className={styles.listsiswa_table_body_icon}
                      onClick={() => handleActionMenu(mapel)}
                      ref={(el) => {
                        ellipsisButtonRefs.current[mapel.kode_mapel] =
                          el as SVGSVGElement;
                        return;
                      }}
                    />
                    {actionMenu?.kode_mapel === mapel.kode_mapel && (
                      <ActionMenu
                        setActionMenu={setActionMenu}
                        actionMenu={actionMenu}
                        setMapelData={setMapelData}
                        setCurrentPage={setCurrentPage}
                        fetchPageData={fetchPageData}
                        currentPage={currentPage}
                        ellipsisButtonRef={{
                          current: ellipsisButtonRefs.current[mapel.kode_mapel],
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

export default ListMapelView;
