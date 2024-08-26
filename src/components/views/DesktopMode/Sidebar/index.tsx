import Image from "next/image";
import styles from "./Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const SidebarView = () => {
  const pathname = usePathname();
  const session = useSession();

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar_logo}>
        <Link href="/">
          <Image
            src="/logors.png"
            alt="Logo"
            width={226}
            height={58}
            className={styles.sidebar_logo_image}
          />
        </Link>
      </div>
      <div className={styles.sidebar_list}>
        <div className={styles.sidebar_list_section}>
          <h3>MAIN</h3>
          <ul className={styles.sidebar_list_section_list}>
            <li
              className={`${
                pathname == "/" ? styles.sidebar_list_section_list_active : ""
              }`}
            >
              <FontAwesomeIcon
                icon={["fas", "home"]}
                className={styles.sidebar_list_section_list_icon}
              />{" "}
              <Link href="/">Dashboard</Link>
            </li>
          </ul>
        </div>
        <div className={styles.sidebar_list_section}>
          <h3>SISWA SECTION</h3>
          <ul className={styles.sidebar_list_section_list}>
            <li
              className={`${
                pathname == "/listsiswa"
                  ? styles.sidebar_list_section_list_active
                  : ""
              }`}
            >
              <FontAwesomeIcon
                icon={["fas", "user-graduate"]}
                className={styles.sidebar_list_section_list_icon}
              />{" "}
              <Link href="/listsiswa">List siswa</Link>
            </li>
            {session.data?.user.role == "Admin" && (
              <li
                className={`${styles.sidebar_list_section_list_add} ${
                  pathname == "/addsiswa"
                    ? styles.sidebar_list_section_list_active
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={["fas", "user-plus"]}
                  className={styles.sidebar_list_section_list_icon_plus}
                />{" "}
                <Link href="/addsiswa">Tambah siswa</Link>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.sidebar_list_section}>
          <h3>GURU SECTION</h3>
          <ul className={styles.sidebar_list_section_list}>
            <li
              className={`${
                pathname == "/listguru"
                  ? styles.sidebar_list_section_list_active
                  : ""
              }`}
            >
              <FontAwesomeIcon
                icon={["fas", "list"]}
                className={styles.sidebar_list_section_list_icon}
              />{" "}
              <Link href="/listguru">List Guru</Link>
            </li>

            <li
              className={`${styles.sidebar_list_section_list_all}  ${
                pathname == "/berandaguru"
                  ? styles.sidebar_list_section_list_active
                  : ""
              }`}
            >
              <FontAwesomeIcon
                icon={["fas", "user-tie"]}
                className={styles.sidebar_list_section_list_icon_all}
              />{" "}
              <Link href="/berandaguru">Beranda Guru</Link>
            </li>
            {session.data?.user.role == "Admin" && (
              <li
                className={`${styles.sidebar_list_section_list_add} ${
                  pathname == "/addguru"
                    ? styles.sidebar_list_section_list_active
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={["fas", "user-plus"]}
                  className={styles.sidebar_list_section_list_icon_plus}
                />{" "}
                <Link href="/addguru">Tambah Guru</Link>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.sidebar_list_section}>
          <h3>MAPEL SECTION</h3>
          <ul className={styles.sidebar_list_section_list}>
            <li
              className={`${
                pathname == "/listmapel"
                  ? styles.sidebar_list_section_list_active
                  : ""
              }`}
            >
              <FontAwesomeIcon
                icon={["fas", "book"]}
                className={styles.sidebar_list_section_list_icon}
              />{" "}
              <Link href="/listmapel">List Mapel</Link>
            </li>
            {session.data?.user.role == "Admin" && (
              <li
                className={`${styles.sidebar_list_section_list_plus}${
                  pathname == "/addmapel"
                    ? styles.sidebar_list_section_list_active
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={["fas", "square-plus"]}
                  className={styles.sidebar_list_section_list_icon_plus}
                />{" "}
                <Link href="/addmapel">Tambah Mapel</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarView;
