import Image from "next/image";
import styles from "./DetailListMapel.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mapel } from "@/types/mapel.type";

type PropsTypes = {
  detailMapel: Mapel | null;
};
const DetailListMapel = ({ detailMapel }: PropsTypes) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header}>
            <FontAwesomeIcon
              icon={["fas", "id-badge"]}
              className={styles.modal_content_item_header_icon}
            />
            <h3>Kode Mapel</h3>
          </div>
          <p>{detailMapel?.kode_mapel}</p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header}>
            <FontAwesomeIcon
              icon={["fas", "user"]}
              className={styles.modal_content_item_header_icon}
            />
            <h3>Nama</h3>
          </div>
          <p>{detailMapel?.nama_mapel}</p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header_kelas}>
            <FontAwesomeIcon
              icon={["fas", "graduation-cap"]}
              className={`${styles.modal_content_item_header_icon} ${styles.modal_content_item_header_kelas_icon}`}
            />
            <h3>Jurusan</h3>
          </div>
          <p>{detailMapel?.jurusan}</p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header_hp}>
            <FontAwesomeIcon
              icon={["fas", "phone"]}
              className={`${styles.modal_content_item_header_icon} ${styles.modal_content_item_header_hp_icon}`}
            />
            <h3>Fase</h3>
          </div>
          <p>{detailMapel?.fase}</p>
        </div>
        <div className={styles.modal_content_item}>
          <div className={styles.modal_content_item_header}>
            <FontAwesomeIcon
              icon={["fas", "location-dot"]}
              className={styles.modal_content_item_header_icon}
            />
            <h3>Tipe Mapel</h3>
          </div>
          <p>{detailMapel?.tipe_mapel}</p>
        </div>
        <div className={styles.modal_content_item_header}>
          <FontAwesomeIcon
            icon={["fas", "book-bookmark"]}
            className={styles.modal_content_item_header_icon}
          />
          <h3>Guru</h3>
        </div>
        <ul className={styles.modal_content_item_text}>
          {detailMapel?.guruandmapel &&
          detailMapel?.guruandmapel?.length > 0 ? (
            detailMapel.guruandmapel?.map((item, index) => (
              <li key={index} className={styles.modal_content_item_text_list}>
                {item.guru.nama}
              </li>
            ))
          ) : (
            <li>Tidak Ada Mapel</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DetailListMapel;
