import userServices from "@/services/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";
import Modal from "@/components/ui/Modal";
import SidebarView from "./Sidebar";

const listTitleNavbar = [
  {
    title: "Dashboard",
    url: "/",
  },
  {
    title: "List Siswa",
    url: "/listsiswa",
  },
  {
    title: "Add Siswa",
    url: "/addsiswa",
  },
  {
    title: "List Guru",
    url: "/listguru",
  },
  {
    title: "Add Guru",
    url: "/addguru",
  },
  {
    title: "Beranda Guru",
    url: "/berandaguru",
  },
  {
    title: "List Mapel",
    url: "/listmapel",
  },
  {
    title: "Add Mapel",
    url: "/addmapel",
  },
];
const NavbarMobileView = () => {
  const pathname = usePathname();
  const { push } = useRouter();
  const [profile, setProfile] = useState<User | any>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const session = useSession();
  const getProfile = async () => {
    const { data } = await userServices.getProfile();
    setProfile(data.user);
  };
  useEffect(() => {
    if (session.data) {
      getProfile();
    }
  }, [session.data]);
  const getTitle = (pathname: string) => {
    const item = listTitleNavbar.find((item) => item.url === pathname);
    return item ? item.title : "Not found";
  };
  const title = getTitle(pathname);
  return (
    <>
      <div className={styles.navbar}>
        <FontAwesomeIcon
          icon={["fas", "bars"]}
          className={styles.navbar_icon}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <h1>{title}</h1>
      </div>
      {sidebarOpen && <SidebarView onClose={() => setSidebarOpen(false)} />}
    </>
  );
};

export default NavbarMobileView;
