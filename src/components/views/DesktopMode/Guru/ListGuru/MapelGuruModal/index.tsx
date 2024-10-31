import Modal from "@/components/ui/Modal";
import styles from "./MapelGuruModal.module.scss";

import { Guru } from "@/types/guru.types";
type MapelGuruModalProps = {
  guru: Guru;
  onClose: () => void;
};

const MapelGuruModal = ({ guru, onClose }: MapelGuruModalProps) => {
  return (
    <Modal onClose={onClose}>
      <div className={styles.guruModal}>
        <h2>{guru.nama} Mengajar</h2>
        <ul className={styles.guruModal_list}>
          {guru.guruandmapel?.map((item, index) => (
            <li key={index} className={styles.guruModal_list_item}>
              {item.mapel.nama_mapel} - {item.mapel.jurusan}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default MapelGuruModal;
