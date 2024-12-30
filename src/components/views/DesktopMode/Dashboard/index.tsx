"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Dashboard.module.scss";
import { IconName } from "@fortawesome/fontawesome-svg-core";

type PropTypes = {
  totalData: { totalSiswa: number; totalGuru: number; totalMapel: number };
};

const listTotal: { title: string; icon: IconName }[] = [
  {
    title: "Siswa",
    icon: "user-graduate",
  },
  {
    title: "Guru",
    icon: "user-tie",
  },
  {
    title: "Mapel",
    icon: "book",
  },
];
const DashboardView = ({ totalData }: PropTypes) => {
  const getTotalCount = (title: string): number => {
    switch (title) {
      case "Siswa":
        return totalData.totalSiswa;
      case "Guru":
        return totalData.totalGuru;
      case "Mapel":
        return totalData.totalMapel;
      default:
        return 0;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard_content}>
        {listTotal.map((item) => (
          <DashboardItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            count={getTotalCount(item.title)}
          />
        ))}
      </div>
      <div className={styles.dashboard_welcome}>
        <h2 className={styles.dashboard_welcome_text}>
          Selamat Datang di Sistem Informasi SMKN 4 Bandar Lampung - Silahkan
          gunakan sistem navigasi di kiri untuk melihat kontent
        </h2>
      </div>
    </div>
  );
};

const DashboardItem = ({
  title,
  icon,
  count,
}: {
  title: string;
  icon: IconName;
  count: number;
}) => {
  return (
    <div className={styles.dashboard_content_item}>
      <FontAwesomeIcon
        icon={["fas", icon]}
        className={styles.dashboard_content_item_icon}
      />
      <div className={styles.dashboard_content_item_text}>
        <h1 className={styles.dashboard_content_item_text_title}>
          Jumlah {title}
        </h1>
        <p className={styles.dashboard_content_item_text_count}>
          {count} {title}
        </p>
      </div>
    </div>
  );
};

export default DashboardView;
