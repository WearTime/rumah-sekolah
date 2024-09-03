"use client";

import styles from "./Layout.module.scss";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useMediaQuery } from "react-responsive";
import NavbarMobileView from "@/components/views/MobileMode/Navbar";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/app/navbar";
import Sidebar from "../../DesktopMode/Sidebar";

const disableNavbar = ["/login", "/register", "/404"];
const disableSidebar = ["/login", "/register"];

// Komponen untuk mengatur layout berdasarkan sesi
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before using useMediaQuery
  useEffect(() => {
    setMounted(true);
  }, []);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1022px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 1023px)" });
  const { status } = useSession();

  // If the component is not mounted, return null to avoid hydration mismatch
  if (!mounted) return null;

  return status !== "authenticated" ? (
    <>
      <h1>Hi</h1>;
    </>
  ) : (
    <>
      {isTabletOrMobile && (
        <div className={styles["main-mobile"]}>
          {!disableNavbar.includes(pathname) && <NavbarMobileView />}
          {/* <div className="content">{children}</div> */}
        </div>
      )}
      {isDesktop && (
        <div className={styles["main-desktop"]}>
          {!disableSidebar.includes(pathname) && <Sidebar />}
          <div>
            {!disableNavbar.includes(pathname) && <Navbar />}
            <div className={styles["content"]}>
              <Toaster position="top-right" />
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppLayout;
