import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Dashboard.module.scss";

const DashboardView = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard_content}>
        <div className={styles.dashboard_content_item}>
          <div className={styles.dashboard_content_item_text}>
            <h1 className={styles.dashboard_content_item_text_title}>
              Jumlah Siswa
            </h1>
            <p className={styles.dashboard_content_item_text_count}>
              2000 Siswa
            </p>
          </div>

          <FontAwesomeIcon
            icon={["fas", "user-graduate"]}
            className={styles.dashboard_content_item_icon}
          />
        </div>
        <div className={styles.dashboard_content_item}>
          <div className={styles.dashboard_content_item_text}>
            <h1 className={styles.dashboard_content_item_text_title}>
              Jumlah Guru
            </h1>
            <p className={styles.dashboard_content_item_text_count}>200 Guru</p>
          </div>

          <FontAwesomeIcon
            icon={["fas", "user-tie"]}
            className={styles.dashboard_content_item_icon}
          />
        </div>
        <div className={styles.dashboard_content_item}>
          <div className={styles.dashboard_content_item_text}>
            <h1 className={styles.dashboard_content_item_text_title}>
              Jumlah Mapel
            </h1>
            <p className={styles.dashboard_content_item_text_count}>20 Mapel</p>
          </div>

          <FontAwesomeIcon
            icon={["fas", "book"]}
            className={styles.dashboard_content_item_icon}
          />
        </div>
      </div>
      <div className={styles.dashboard_welcome}>
        <h2>Selamat Datang di Sistem Informasi SMKN 4 Bandar Lampung</h2>
        <p>Silahkan gunakan sistem navigasi di kiri untuk melihat kontent</p>
      </div>
    </div>
  );
};

export default DashboardView;
