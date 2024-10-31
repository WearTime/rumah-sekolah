"use client";
import styles from "./Listmapel.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionMenu from "./ActionMenu";
import GuruModalMapel from "./GuruModalMapel"; // Import GuruModalMapel
import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import Button from "@/components/ui/Button";
import { Mapel } from "@/types/mapel.type";
import dataMapelServices from "@/services/dataMapel";
import { useSession } from "next-auth/react";

type PropTypes = {
  mapel: Mapel[];
  total: number;
};

const SEARCH_DELAY = 1000;

const ListMapelView = ({ mapel, total }: PropTypes) => {
  const { debounce } = useDebounce();
  const { data } = useSession();
  const role = data?.user.role;
  const [mapelData, setMapelData] = useState<Mapel[]>([]);
  const [actionMenu, setActionMenu] = useState<Mapel | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedMapel, setSelectedMapel] = useState<Mapel | null>(null);
  const [isGuruModalOpen, setIsGuruModalOpen] = useState(false);
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
      <div className={styles.listmapel}>
        <div className={styles.listmapel_search}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Cari nama siswa"
            className={styles.listmapel_search_input}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table className={styles.listmapel_table}>
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama</th>
              <th>Fase</th>
              <th>Tipe</th>
              <th>Jurusan</th>
              <th>Guru Pengajar</th>
              <th></th>
            </tr>
          </thead>
          <tbody className={styles.listmapel_table_body}>
            {mapelData.length > 0 ? (
              mapelData.map((mapel: Mapel) => (
                <tr key={mapel.kode_mapel}>
                  <td>{mapel.kode_mapel}</td>
                  <td>{mapel.nama_mapel}</td>
                  <td>{mapel.fase}</td>
                  <td>{mapel.tipe_mapel}</td>
                  <td>{mapel.jurusan}</td>
                  <td>
                    {mapel.guruandmapel && mapel?.guruandmapel?.length > 1 ? (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          className={styles.listmapel_table_body_guru_button}
                          onClick={() => {
                            setSelectedMapel(mapel);
                            setIsGuruModalOpen(true);
                          }}
                        >
                          See More
                        </Button>
                      </>
                    ) : (
                      mapel.guruandmapel?.[0]?.guru.nama || "Tidak ada"
                    )}
                  </td>
                  {role === "Admin" && (
                    <td>
                      <FontAwesomeIcon
                        icon={["fas", "ellipsis"]}
                        className={styles.listmapel_table_body_icon}
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
                            current:
                              ellipsisButtonRefs.current[mapel.kode_mapel],
                          }}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className={styles.listmapel_table_body_empty}>
                  Data Kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={styles.listmapel_pagination}>
          <Button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={styles.listmapel_pagination_prev}
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
            className={styles.listmapel_pagination_prev}
          >
            Next
          </Button>
        </div>
      </div>
      {isGuruModalOpen && selectedMapel && (
        <GuruModalMapel
          mapel={selectedMapel}
          onClose={() => setIsGuruModalOpen(false)}
        />
      )}
    </>
  );
};

export default ListMapelView;
