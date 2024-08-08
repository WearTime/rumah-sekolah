import Image from "next/image";
import styles from "./Navbar.module.scss";
import { useSession } from "next-auth/react";
import Link from "next/link";

const NavbarView = () => {
  const { data: session, status } = useSession();

  // console.log(session.user.username);

  return (
    <div className={styles.navbar}>
      <h1>Dashboard</h1>

      {session ? (
        <div className={styles.navbar_profile}>
          <Image
            src="/circle-user-solid.svg"
            alt="Profile"
            width={35}
            height={35}
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
