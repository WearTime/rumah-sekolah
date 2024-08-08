import Image from "next/image";
import styles from "./Navbar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const NavbarView = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <Link href="/">
          <Image src="/logors.png" alt="Logo" width={226} height={58} />
        </Link>
      </div>
      <div className={styles.navbar_list}>
        <div className={styles.navbar_list_section}>
          <h3>MAIN</h3>
          <ul className={styles.navbar_list_section_list}>
            <li className={`${styles.navbar_list_section_list_active}`}>
              <FontAwesomeIcon
                icon={["fas", "home"]}
                className={styles.navbar_list_section_list_icon}
              />{" "}
              <Link href="/">Dashboard</Link>
            </li>
          </ul>
        </div>
        <div className={styles.navbar_list_section}>
          <h3>SISWA SECTION</h3>
          <ul className={styles.navbar_list_section_list}>
            <li>
              <FontAwesomeIcon
                icon={["fas", "user-graduate"]}
                className={styles.navbar_list_section_list_icon}
              />{" "}
              <Link href="/">List siswa</Link>
            </li>
            <li className={`${styles.navbar_list_section_list_add}`}>
              <FontAwesomeIcon
                icon={["fas", "user-plus"]}
                className={styles.navbar_list_section_list_icon_plus}
              />{" "}
              <Link href="/">Tambah siswa</Link>
            </li>
          </ul>
        </div>
        <div className={styles.navbar_list_section}>
          <h3>GURU SECTION</h3>
          <ul className={styles.navbar_list_section_list}>
            <li>
              <FontAwesomeIcon
                icon={["fas", "list"]}
                className={styles.navbar_list_section_list_icon}
              />{" "}
              <Link href="/">List Guru</Link>
            </li>

            <li className={`${styles.navbar_list_section_list_all}`}>
              <FontAwesomeIcon
                icon={["fas", "user-tie"]}
                className={styles.navbar_list_section_list_icon_all}
              />{" "}
              <Link href="/">Beranda Guru</Link>
            </li>

            <li className={`${styles.navbar_list_section_list_add}`}>
              <FontAwesomeIcon
                icon={["fas", "user-plus"]}
                className={styles.navbar_list_section_list_icon_plus}
              />{" "}
              <Link href="/">Tambah Guru</Link>
            </li>
          </ul>
        </div>
        <div className={styles.navbar_list_section}>
          <h3>MAPEL SECTION</h3>
          <ul className={styles.navbar_list_section_list}>
            <li>
              <FontAwesomeIcon
                icon={["fas", "book"]}
                className={styles.navbar_list_section_list_icon}
              />{" "}
              <Link href="/">List Mapel</Link>
            </li>

            <li className={`${styles.navbar_list_section_list_plus}`}>
              <FontAwesomeIcon
                icon={["fas", "square-plus"]}
                className={styles.navbar_list_section_list_icon_plus}
              />{" "}
              <Link href="/">Tambah Mapel</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavbarView;
