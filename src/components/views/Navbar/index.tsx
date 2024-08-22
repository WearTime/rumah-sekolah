import Image from "next/image";
import styles from "./Navbar.module.scss";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DetailProfilUser from "./DetailProfileUser";
import Modal from "@/components/ui/Modal";
import userServices from "@/services/user";
import { User } from "@/types/user.types";

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
const NavbarView = () => {
  const pathname = usePathname();
  const { push } = useRouter();
  const [modalProfileUser, setModalProfileUser] = useState(false);
  const [dropdownUser, setDropdownUser] = useState(false);
  const [profile, setProfile] = useState<User | any>({});
  const getProfile = async () => {
    const { data } = await userServices.getProfile();
    setProfile(data.user);
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <div className={styles.navbar}>
        {listTitleNavbar.map(
          (item) =>
            pathname == item.url && <h1 key={item.title}>{item.title}</h1>
        )}
        {profile ? (
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
    </>
  );
};

export default NavbarView;
