import Image from "next/image";
import styles from "./Navbar.module.scss";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <div className={styles.navbar}>
      {listTitleNavbar.map(
        (item) =>
          pathname == item.url && (
            <h1 onClick={() => signOut()} key={item.title}>
              {item.title}
            </h1>
          )
      )}
      {/* <h1>Gest</h1> */}
      {session ? (
        <div className={styles.navbar_profile}>
          <Image
            src="/circle-user-solid.svg"
            alt="Profile"
            width={35}
            height={35}
            className={styles.navbar_profile_image}
          />
          <h3>{session.user.username}</h3>
        </div>
      ) : (
        <button className={styles.navbar_login}>
          <Link href={"/login"}>Login</Link>
        </button>
      )}
    </div>
  );
};

export default NavbarView;
