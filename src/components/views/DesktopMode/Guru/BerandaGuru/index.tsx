import { Guru } from "@/types/guru.types";
import styles from "./BerandaGuru.module.scss";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import dataGuruServices from "@/services/dataGuru";
import DetailListGuru from "../DetailListGuru";

type PropTypes = {
  guru: Guru[];
  total: number;
};
const BerandaGuruView = ({ guru, total }: PropTypes) => {
  const [guruData, setGuruData] = useState<Guru[]>([]);
  const [detailGuru, setDetailGuru] = useState<Guru | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    setGuruData(guru);
  }, [guru]);

  const fetchPageData = async (page: number) => {
    const { data } = await dataGuruServices.getAllGuru({ page, search: " " });
    setGuruData(data.data);
    setCurrentPage(page);
  };

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
      <div className={styles.berandaguru}>
        <div className={styles.berandaguru_content}>
          {guruData.length > 0 ? (
            guruData.map((guruData: Guru) => (
              <div
                className={styles.berandaguru_content_item}
                key={guruData.nip}
              >
                <Image
                  src={
                    guruData?.image
                      ? `http://localhost:3000${guruData?.image}`
                      : "/blankpp.jpeg"
                  }
                  width={150}
                  height={150}
                  alt={`${guruData.nama}`}
                  className={styles.berandaguru_content_item_image}
                />
                <Button
                  type="button"
                  className={styles.berandaguru_content_item_button}
                  onClick={() => {
                    setDetailGuru(guruData);
                    setIsDetailOpen(true);
                  }}
                >
                  Lihat Detail
                </Button>
              </div>
            ))
          ) : (
            <h1 className={styles.berandaguru_content_kosong}>Data Kosong</h1>
          )}
        </div>
        <div className={styles.berandaguru_content_pagination}>
          <Button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={styles.berandaguru_content_pagination_prev}
          >
            Prev
          </Button>
          <span>
            {currentPage} of {totalPages}
          </span>

          <Button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
            className={styles.berandaguru_content_pagination_prev}
          >
            Next
          </Button>
        </div>
      </div>
      {isDetailOpen && (
        <Modal onClose={() => setIsDetailOpen(false)}>
          <DetailListGuru detailGuru={detailGuru} />
        </Modal>
      )}
    </>
  );
};

export default BerandaGuruView;
