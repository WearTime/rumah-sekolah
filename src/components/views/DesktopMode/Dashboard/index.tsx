"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Dashboard.module.scss";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";

type PropTypes = {
  totalData: { totalSiswa: number; totalGuru: number; totalMapel: number };
};

const listTotal: {
  title: string;
  icon: IconName;
  description: boolean;
  color: string;
  link?: string;
}[] = [
  {
    title: "Ekstrakurikuler",
    icon: "user-graduate",
    description: false,
    color: "#07754b",
  },
  {
    title: "Structure Organisasi",
    icon: "user-graduate",
    description: false,
    color: "#a0b817",
    link: "/struktur-organisasi",
  },
  {
    title: "Siswa",
    icon: "user-graduate",
    description: true,
    color: "#e08c2b",
  },
  {
    title: "Guru",
    icon: "user-tie",
    description: true,
    color: "#17a2b8",
  },
  {
    title: "Mapel",
    icon: "book",
    description: true,
    color: "#28a745",
  },
  {
    title: "Staff TU",
    icon: "clipboard-user",
    description: true,
    color: "#171ab8",
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
      <h1 className={styles.dashboard_title}>
        Selamat Datang di Sistem Informasi SMKN 4 Bandar Lampung
      </h1>
      <div className={styles.dashboard_visinmisi}>
        <div className={`${styles.dashboard_visinmisi_content}`}>
          <h1>Visi</h1>
          <div className={styles.dashboard_visinmisi_content_item}>
            <p>
              Menghasilkan lulusan yang unggul, mampu bersaing dipasar global
              dan berkarakter Pancasila.
            </p>
          </div>
        </div>
        <div
          className={`${styles.dashboard_visinmisi_content} ${styles.dashboard_visinmisi_content_misi}`}
        >
          <h1>Misi</h1>
          <div className={styles.dashboard_visinmisi_content_item}>
            <p>
              1. Menyelenggarakan kegiatan pembelajaran yang berpusat pada
              peserta didik yang berkarakter Pancasila dengan menerapkan
              Teaching Factory dan berbasis industry melalui pendekatan
              teknologi informatika dan komunikasi serta mencetak jiwa
              wirausaha/entrepreneurship.
            </p>
            <p>
              2. Menjalin dan mengembangkan kerjasama kemitraan dengan dunia
              kerja dalam mengembangkan kurikulum untuk menghasilkan lulusan
              yang unggul sesuai standar industri nasional dan internasional.
            </p>
            <p>
              3. Menggunakan sarana dan peralatan praktik yang sesuai dengan
              Standar Industri.
            </p>
            <p>
              4. Menerapkan pendidikan anti perundungan, ramah lingkungan,
              menyenangkan, harmonis dan dinamis
            </p>
          </div>
        </div>
      </div>
      <div className={styles.dashboard_content}>
        <div className={styles.dashboard_content_container}>
          {listTotal.map((item) => (
            <DashboardItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              description={item.description}
              count={getTotalCount(item.title)}
              color={item.color}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardItem = ({
  title,
  icon,
  count,
  description,
  color,
  link,
}: {
  title: string;
  icon: IconName;
  count: number;
  description: boolean;
  color: string;
  link?: string;
}) => {
  return (
    <Link
      href={link ? link : "/"}
      className={styles.dashboard_content_container_item}
      style={{ backgroundColor: color }}
    >
      <FontAwesomeIcon
        icon={["fas", icon]}
        className={styles.dashboard_content_container_item_icon}
      />
      <div className={styles.dashboard_content_container_item_text}>
        <h1 className={styles.dashboard_content_container_item_text_title}>
          {description ? `Jumlah ${title}` : title}
        </h1>
        {description && (
          <p className={styles.dashboard_content_container_item_text_count}>
            {count} {title}
          </p>
        )}
      </div>
    </Link>
  );
};

export default DashboardView;
