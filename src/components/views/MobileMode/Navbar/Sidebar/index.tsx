import { useRef, useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

type PropsTypes = {
  onClose: () => void;
};
const listMapel = [
  {
    title: "AKL",
    url: "akl",
  },
  {
    title: "PPLG",
    url: "pplg",
  },
  {
    title: "TJKT",
    url: "tjkt",
  },
  {
    title: "DKV",
    url: "dkv",
  },
  {
    title: "MPLB",
    url: "mplb",
  },
  {
    title: "KULINER",
    url: "kuliner",
  },
  {
    title: "TATA BUSANA",
    url: "tatabusana",
  },
  {
    title: "PHT",
    url: "pht",
  },
  {
    title: "ULW",
    url: "ulw",
  },
];
const SidebarView = ({ onClose }: PropsTypes) => {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const session = useSession();
  const [mapelOpen, setMapelOpen] = useState(false);
  const toggleMapelDropdown = () => setMapelOpen(!mapelOpen);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <div className={styles.sidebar} ref={ref}>
      <div className={styles.sidebar_close}>
        <FontAwesomeIcon
          icon={["fas", "xmark"]}
          className={styles.navbar_icon}
          onClick={() => onClose()}
        />
      </div>
      <div className={styles.sidebar_content}>
        <div className={styles.sidebar_content_logo}>
          <Link href={"/"}>
            <Image
              src="/logors.png"
              alt="Logo"
              width={196}
              height={52}
              className={styles.sidebar_content_logo_image}
            />
          </Link>
        </div>

        <div className={styles.sidebar_content_list}>
          <div className={styles.sidebar_content_list_section}>
            <h3>MAIN</h3>
            <ul className={styles.sidebar_content_list_section_list}>
              <li
                className={`${
                  pathname == "/"
                    ? styles.sidebar_content_list_section_list_active
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={["fas", "home"]}
                  className={styles.sidebar_content_list_section_list_icon}
                />{" "}
                <Link href="/">Dashboard</Link>
              </li>
            </ul>
          </div>
          <div className={styles.sidebar_content_list_section}>
            <h3>SISWA SECTION</h3>
            <ul className={styles.sidebar_content_list_section_list}>
              <li
                className={`${
                  pathname == "/listsiswa"
                    ? styles.sidebar_content_list_section_list_active
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={["fas", "user-graduate"]}
                  className={styles.sidebar_content_list_section_list_icon}
                />{" "}
                <Link href="/listsiswa">List siswa</Link>
              </li>
              {session.data?.user.role == "Admin" && (
                <li
                  className={`${styles.sidebar_content_list_section_list_add} ${
                    pathname == "/addsiswa"
                      ? styles.sidebar_content_list_section_list_active
                      : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={["fas", "user-plus"]}
                    className={
                      styles.sidebar_content_list_section_list_icon_plus
                    }
                  />{" "}
                  <Link href="/addsiswa">Tambah siswa</Link>
                </li>
              )}
            </ul>
          </div>
          <div className={styles.sidebar_content_list_section}>
            <h3>GURU SECTION</h3>
            <ul className={styles.sidebar_content_list_section_list}>
              <li
                className={`${
                  pathname == "/listguru"
                    ? styles.sidebar_content_list_section_list_active
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={["fas", "list"]}
                  className={styles.sidebar_content_list_section_list_icon}
                />{" "}
                <Link href="/listguru">List Guru</Link>
              </li>

              <li
                className={`${styles.sidebar_content_list_section_list_all}  ${
                  pathname == "/berandaguru"
                    ? styles.sidebar_content_list_section_list_active
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={["fas", "user-tie"]}
                  className={styles.sidebar_content_list_section_list_icon_all}
                />{" "}
                <Link href="/berandaguru">Beranda Guru</Link>
              </li>
              {session.data?.user.role == "Admin" && (
                <li
                  className={`${styles.sidebar_content_list_section_list_add} ${
                    pathname == "/addguru"
                      ? styles.sidebar_content_list_section_list_active
                      : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={["fas", "user-plus"]}
                    className={
                      styles.sidebar_content_list_section_list_icon_plus
                    }
                  />{" "}
                  <Link href="/addguru">Tambah Guru</Link>
                </li>
              )}
            </ul>
          </div>
          <div className={styles.sidebar_content_list_section}>
            <h3>MAPEL SECTION</h3>
            <ul className={styles.sidebar_content_list_section_list}>
              <li
                className={
                  styles.sidebar_content_list_section_list_dropdown_toggle
                }
                onClick={toggleMapelDropdown}
              >
                <FontAwesomeIcon
                  icon={["fas", "book"]}
                  className={styles.sidebar_list_section_list_icon}
                />{" "}
                <span>List Mapel</span>
                <FontAwesomeIcon
                  icon={["fas", mapelOpen ? "chevron-down" : "chevron-left"]}
                  className={
                    styles.sidebar_content_list_section_list_dropdown_icon
                  }
                />
              </li>

              {mapelOpen && (
                <ul
                  className={
                    styles.sidebar_content_list_section_list_dropdown_list
                  }
                >
                  {listMapel.map((mapel) => (
                    <li
                      key={mapel.url}
                      className={`${
                        pathname === `/listmapel/${mapel.url}`
                          ? styles.sidebar_content_list_section_list_active +
                            " " +
                            styles.sidebar_content_list_section_list_dropdown_active
                          : ""
                      }`}
                    >
                      <Link href={`/listmapel/${mapel.url}`}>
                        {mapel.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {session.data?.user.role == "Admin" && (
                <li
                  className={`${styles.sidebar_content_list_section_list_plus}${
                    pathname == "/addmapel"
                      ? styles.sidebar_content_list_section_list_active
                      : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={["fas", "square-plus"]}
                    className={
                      styles.sidebar_content_list_section_list_icon_plus
                    }
                  />{" "}
                  <Link href="/addmapel">Tambah Mapel</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarView;
