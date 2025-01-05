"use client";
import styles from "./Listguru.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionMenu from "./ActionMenu";
import { useEffect, useState, useRef, SetStateAction } from "react";
import useDebounce from "@/hooks/useDebounce";
import Button from "@/components/ui/Button";
import { Guru } from "@/types/guru.types";
import dataGuruServices from "@/services/dataGuru";
import MapelGuruModal from "./MapelGuruModal";
import { useMediaQuery } from "react-responsive";
import Modal from "@/components/ui/Modal";
import DeleteListGuru from "./DeleteListGuru";
import EditListGuru from "./EditListGuru";
import DetailListSiswa from "../DetailListGuru";

type PropTypes = {
  guru: Guru[];
  total: number;
};

const SEARCH_DELAY = 1000; // Delay untuk debounce

const ListGuruView = ({ guru, total }: PropTypes) => {
  const { debounce } = useDebounce();
  const [guruData, setGuruData] = useState<Guru[]>(guru);
  const [actionMenu, setActionMenu] = useState<Guru | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(total); // Track total dynamically
  const [pageSize] = useState(12);
  const isMobile = useMediaQuery({ query: "(max-width: 340px)" });
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);
  const [isMapelGuruModalOpen, setIsMapelGuruModalOpen] = useState(false);
  const totalPages = Math.ceil(totalItems / pageSize);
  const [deletedGuru, setDeletedGuru] = useState<Guru | null>(null);
  const [editGuru, setEditGuru] = useState<Guru | null>(null);
  const [detailGuru, setDetailGuru] = useState<Guru | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<{
    deleteModal: boolean;
    editModal: boolean;
    detailModal: boolean;
  }>({ deleteModal: false, editModal: false, detailModal: false });

  const ellipsisButtonRefs = useRef<{ [key: string]: SVGSVGElement | null }>(
    {}
  );

  const handleActionMenu = (selectedGuru: Guru) => {
    setActionMenu(actionMenu?.nip === selectedGuru.nip ? null : selectedGuru);
  };

  const fetchPageData = async (page: number) => {
    const response = await dataGuruServices.getAllGuru({ page, search });
    const { data, total: newTotal } = response.data;
    setGuruData(data);
    setTotalItems(newTotal);
    setCurrentPage(page);
  };

  const performSearch = () => {
    if (search) {
      fetchPageData(1);
    } else {
      setGuruData(guru);
      setTotalItems(total);
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

  const handleDetailClick = (guru: SetStateAction<Guru | null>) => {
    setDetailGuru(guru);
    setIsModalOpen({
      detailModal: true,
      editModal: false,
      deleteModal: false,
    });
  };

  const handleEditClick = (guru: SetStateAction<Guru | null>) => {
    setEditGuru(guru);
    setIsModalOpen({
      detailModal: false,
      editModal: true,
      deleteModal: false,
    });
  };

  const handleDeleteClick = (guru: SetStateAction<Guru | null>) => {
    setDeletedGuru(guru);
    setIsModalOpen({
      detailModal: false,
      editModal: false,
      deleteModal: true,
    });
  };

  return (
    <>
      <div className={styles.listguru}>
        <div className={styles.listguru_search}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Cari nama guru"
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
              guruData.map((guru, index) => (
                <tr key={guru.nip}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{guru.nama}</td>
                  <td>{guru.nip}</td>
                  <td>{guru.no_hp}</td>
                  <td>{guru.alamat}</td>
                  <td>
                    {guru.guruandmapel && guru.guruandmapel.length > 1 ? (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          className={styles.listguru_table_body_guru_button}
                          onClick={() => {
                            setSelectedGuru(guru);
                            setIsMapelGuruModalOpen(true);
                          }}
                        >
                          See More
                        </Button>
                      </>
                    ) : (
                      guru?.guruandmapel?.[0]?.mapel.nama_mapel || "Tidak ada"
                    )}
                  </td>
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
                <td colSpan={7} className={styles.listguru_table_body_empty}>
                  Data Kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.listguru_tableMobile}>
          {guruData.length > 0 ? (
            guruData.map((guru, index) => (
              <div
                key={guru.nip}
                className={styles.listguru_tableMobile_container}
              >
                <div className={styles.listguru_tableMobile_container_title}>
                  <p>Nama</p>
                  <h1>{guru.nama}</h1>
                </div>
                <hr />
                <div className={styles.listguru_tableMobile_container_item}>
                  <p>NIP</p>
                  <p>{guru.nip}</p>
                </div>
                <hr />
                <div className={styles.listguru_tableMobile_container_item}>
                  <p>No Hp</p>
                  <p>{guru.no_hp}</p>
                </div>
                <hr />
                <div className={styles.listguru_tableMobile_container_item}>
                  <p>Alamat</p>
                  <p>{guru.alamat}</p>
                </div>
                <hr />
                <div className={styles.listguru_tableMobile_container_item}>
                  <p>Mapel</p>
                  <p>
                    {guru.guruandmapel && guru.guruandmapel.length > 1 ? (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          className={
                            styles.listguru_tableMobile_container_item_seeMore
                          }
                          onClick={() => {
                            setSelectedGuru(guru);
                            setIsMapelGuruModalOpen(true);
                          }}
                        >
                          See More
                        </Button>
                      </>
                    ) : (
                      guru?.guruandmapel?.map(
                        (item) => item.mapel.nama_mapel
                      ) || "Tidak ada mapel"
                    )}
                  </p>
                </div>
                <hr />
                <div className={styles.listguru_tableMobile_container_btnSect}>
                  <Button
                    type="button"
                    className={
                      styles.listguru_tableMobile_container_btnSect_item
                    }
                    onClick={() => handleDetailClick(guru)}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "circle-info"]}
                      className={
                        styles.listguru_tableMobile_container_btnSect_item_icon
                      }
                    />
                    {!isMobile && "Detail"}
                  </Button>
                  <Button
                    type="button"
                    className={
                      styles.listguru_tableMobile_container_btnSect_item
                    }
                    onClick={() => handleEditClick(guru)}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "pen-to-square"]}
                      className={
                        styles.listguru_tableMobile_container_btnSect_item_icon
                      }
                    />
                    {!isMobile && "Edit"}
                  </Button>
                  <Button
                    type="button"
                    className={
                      styles.listguru_tableMobile_container_btnSect_item
                    }
                    onClick={() => handleDeleteClick(guru)}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "trash"]}
                      className={
                        styles.listguru_tableMobile_container_btnSect_item_icon
                      }
                    />
                    {!isMobile && "Delete"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <h1 className={styles.listguru_tableMobile_empty}> Data Kosong</h1>
          )}
        </div>

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
            className={styles.listguru_pagination_next}
          >
            Next
          </Button>
        </div>
      </div>
      {isMapelGuruModalOpen && selectedGuru && (
        <MapelGuruModal
          guru={selectedGuru}
          onClose={() => setIsMapelGuruModalOpen(false)}
        />
      )}
      {isModalOpen.deleteModal && (
        <Modal
          onClose={() =>
            setIsModalOpen({
              deleteModal: false,
              editModal: false,
              detailModal: false,
            })
          }
        >
          <DeleteListGuru
            deletedGuru={deletedGuru}
            setGuruData={setGuruData}
            setDeletedGuru={setDeletedGuru}
            setCurrentPage={setCurrentPage}
            fetchPageData={fetchPageData}
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      )}
      {isModalOpen.editModal && (
        <Modal
          onClose={() =>
            setIsModalOpen({
              deleteModal: false,
              editModal: false,
              detailModal: false,
            })
          }
        >
          <EditListGuru
            setActionMenu={setActionMenu}
            editGuru={editGuru}
            setGuruData={setGuruData}
            setIsModalOpen={setIsModalOpen}
            currentPage={currentPage}
            fetchPageData={fetchPageData}
          />
        </Modal>
      )}
      {isModalOpen.detailModal && (
        <Modal
          onClose={() =>
            setIsModalOpen({
              deleteModal: false,
              editModal: false,
              detailModal: false,
            })
          }
        >
          <DetailListSiswa detailGuru={detailGuru} />
        </Modal>
      )}
    </>
  );
};

export default ListGuruView;
