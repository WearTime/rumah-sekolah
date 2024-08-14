import Image from "next/image";
import styles from "./DetailListSiswa.module.scss";
import { Siswa } from "@/types/siswa.type";
import { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PropsTypes = {
  detailSiswa: Siswa | null;
  setSiswaData: Dispatch<SetStateAction<Siswa[]>>;
  setIsModalOpen: Dispatch<
    SetStateAction<{
      deleteModal: boolean;
      editModal: boolean;
      detailModal: boolean;
    }>
  >;
};
const DetailListSiswa = ({
  detailSiswa,
  setSiswaData,
  setIsModalOpen,
}: PropsTypes) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal_header}>
        <Image
          className={styles.modal_header_image}
          width={100}
          height={100}
          src={
            detailSiswa?.image
              ? `http://localhost:3000${detailSiswa?.image}`
              : "/blankpp.jpeg"
          }
          alt="huhu"
        />
        <h1>{detailSiswa?.nama}</h1>
      </div>
      <div className={styles.modal_content}>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header}>
            <FontAwesomeIcon
              icon={["fas", "id-badge"]}
              className={styles.modal_content_item_header_icon}
            />
            <h3>Nisn / Nis</h3>
          </div>
          <p>
            {detailSiswa?.nisn} / {detailSiswa?.nis}
          </p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header}>
            <FontAwesomeIcon
              icon={["fas", "user"]}
              className={styles.modal_content_item_header_icon}
            />
            <h3>Nama</h3>
          </div>
          <p>{detailSiswa?.nama}</p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header_kelas}>
            <FontAwesomeIcon
              icon={["fas", "graduation-cap"]}
              className={`${styles.modal_content_item_header_icon} ${styles.modal_content_item_header_kelas_icon}`}
            />
            <h3>Kelas</h3>
          </div>
          <p>
            {detailSiswa?.kelas} {detailSiswa?.jurusan}
          </p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header_hp}>
            <FontAwesomeIcon
              icon={["fas", "phone"]}
              className={`${styles.modal_content_item_header_icon} ${styles.modal_content_item_header_hp_icon}`}
            />
            <h3>No. Hp</h3>
          </div>
          <p>{detailSiswa?.no_hp}</p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header}>
            <FontAwesomeIcon
              icon={["fas", "location-dot"]}
              className={styles.modal_content_item_header_icon}
            />
            <h3>Alamat</h3>
          </div>
          <p>{detailSiswa?.alamat}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailListSiswa;
