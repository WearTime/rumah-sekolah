import Image from "next/image";
import styles from "./DetailListGuru.module.scss";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Guru } from "@/types/guru.types";

type PropsTypes = {
  detailGuru: Guru | null;
};
const DetailListGuru = ({ detailGuru }: PropsTypes) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal_header}>
        <Image
          className={styles.modal_header_image}
          width={130}
          height={130}
          src={
            detailGuru?.image
              ? `http://localhost:3000${detailGuru?.image}`
              : "/blankpp.jpeg"
          }
          alt={`${detailGuru?.nama}`}
        />
        <h1>{detailGuru?.nama}</h1>
      </div>
      <div className={styles.modal_content}>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header}>
            <FontAwesomeIcon
              icon={["fas", "id-badge"]}
              className={styles.modal_content_item_header_icon}
            />
            <h3>Nip</h3>
          </div>
          <p className={styles.modal_content_item_text}>{detailGuru?.nip}</p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header}>
            <FontAwesomeIcon
              icon={["fas", "user"]}
              className={styles.modal_content_item_header_icon}
            />
            <h3>Nama</h3>
          </div>
          <p className={styles.modal_content_item_text}>{detailGuru?.nama}</p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header_hp}>
            <FontAwesomeIcon
              icon={["fas", "phone"]}
              className={`${styles.modal_content_item_header_icon} ${styles.modal_content_item_header_hp_icon}`}
            />
            <h3>No. Hp</h3>
          </div>
          <p className={styles.modal_content_item_text}>{detailGuru?.no_hp}</p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header}>
            <FontAwesomeIcon
              icon={["fas", "location-dot"]}
              className={styles.modal_content_item_header_icon}
            />
            <h3>Alamat</h3>
          </div>
          <p className={styles.modal_content_item_text}>{detailGuru?.alamat}</p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header}>
            <FontAwesomeIcon
              icon={["fas", "book-bookmark"]}
              className={styles.modal_content_item_header_icon}
            />
            <h3>Mapel</h3>
          </div>
          <ul className={styles.modal_content_item_text}>
            {detailGuru?.guruandmapel &&
            detailGuru?.guruandmapel?.length > 0 ? (
              detailGuru.guruandmapel?.map((item, index) => (
                <li key={index} className={styles.modal_content_item_text_list}>
                  {item.mapel.nama_mapel} - {item.mapel.jurusan}
                </li>
              ))
            ) : (
              <li>Tidak Ada Mapel</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailListGuru;
