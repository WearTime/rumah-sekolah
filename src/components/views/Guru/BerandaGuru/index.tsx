import { Guru } from "@/types/guru.types";
import styles from "./BerandaGuru.module.scss";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import DetailListSiswa from "./DetailListGuru";

type PropTypes = {
  guru: Guru[];
  total: number;
};
const BerandaGuruView = ({ guru, total }: PropTypes) => {
  const [guruData, setGuruData] = useState<Guru[]>([]);
  const [detailGuru, setDetailGuru] = useState<Guru | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  useEffect(() => {
    setGuruData(guru);
  }, [guru]);
  return (
    <>
      <div className={styles.berandaguru}>
        {guruData.length > 0 ? (
          guruData.map((guruData: Guru) => (
            <div className={styles.berandaguru_content} key={guruData.nip}>
              <Image
                src={
                  guruData?.image
                    ? `http://localhost:3000${guruData?.image}`
                    : "/blankpp.jpeg"
                }
                width={150}
                height={150}
                alt={`${guruData.nama}`}
                className={styles.berandaguru_content_image}
              />
              <Button
                type="button"
                className={styles.berandaguru_content_button}
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
          <h1 className={styles.berandaguru_kosong}>Data Kosong</h1>
        )}
      </div>
      {isDetailOpen && (
        <Modal onClose={() => setIsDetailOpen(false)}>
          <DetailListSiswa detailGuru={detailGuru} />
        </Modal>
      )}
    </>
  );
};

export default BerandaGuruView;
