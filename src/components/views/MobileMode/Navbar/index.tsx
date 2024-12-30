import userServices from "@/services/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";
import Modal from "@/components/ui/Modal";
import SidebarView from "./Sidebar";
import Image from "next/image";
import Link from "next/link";
import DetailProfilUser from "../../DesktopMode/Navbar/DetailProfileUser";

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
  const [modalProfileUser, setModalProfileUser] = useState(false);
  const [dropdownUser, setDropdownUser] = useState(false);
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
        {session.data ? (
          <div className={styles.navbar_profile}>
            <div
              className={styles.navbar_profile_detail}
              onClick={() => setDropdownUser(!dropdownUser)}
            >
              <div className={styles.navbar_profile_detail_avatar}>
                <Image
                  src={`${
                    profile.profile
                      ? `http://localhost:3000${profile.profile}`
                      : "/circle-user-solid.svg"
                  }`}
                  alt="Profile"
                  width={55}
                  height={55}
                  className={styles.navbar_profile_detail_avatar_image}
                />
              </div>
              <h3>{profile.username}</h3>
            </div>
            <div
              className={`${styles.navbar_profile_dropdown} ${
                dropdownUser && styles["navbar_profile_dropdown--active"]
              }`}
            >
              <button
                className={styles.navbar_profile_dropdown_item}
                onClick={() => setModalProfileUser(true)}
              >
                Profile
              </button>
              <button
                className={styles.navbar_profile_dropdown_item}
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button className={styles.navbar_login}>
            <Link href={"/login"}>Login</Link>
          </button>
        )}
      </div>
      {modalProfileUser && (
        <Modal
          onClose={() => setModalProfileUser(false)}
          className={styles.modal}
        >
          <DetailProfilUser
            profile={profile}
            setProfile={setProfile}
            setModalProfileUser={setModalProfileUser}
          />
        </Modal>
      )}
      {sidebarOpen && <SidebarView onClose={() => setSidebarOpen(false)} />}
    </>
  );
};

export default NavbarMobileView;
