import Modal from "@/components/ui/Modal";
import { Mapel } from "@/types/mapel.type";
import styles from "./GuruModalMapel.module.scss";

type GuruModalMapelProps = {
  mapel: Mapel;
  onClose: () => void;
};

const GuruModalMapel = ({ mapel, onClose }: GuruModalMapelProps) => {
  return (
    <Modal onClose={onClose}>
      <div className={styles.guruModal}>
        <h2>Guru Pengajar {mapel.nama_mapel}</h2>
        <ul className={styles.guruModal_list}>
          {mapel.guruandmapel?.map((item, index) => (
            <li key={index} className={styles.guruModal_list_item}>
              {item.guru.nama}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default GuruModalMapel;
