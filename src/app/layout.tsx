"use client";

import { Lato } from "next/font/google";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { usePathname } from "next/navigation";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config, dom, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import NavbarMobileView from "@/components/views/MobileMode/Navbar";
import { useEffect, useState } from "react";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const disableNavbar = ["/login", "/register", "/404"];
const disableSidebar = ["/login", "/register"];

library.add(fas);
config.autoAddCss = false;

// Komponen untuk mengatur layout berdasarkan sesi
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before using useMediaQuery
  useEffect(() => {
    setMounted(true);
  }, []);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1022px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 1023px)" });
  const { data: session, status } = useSession();

  // If the component is not mounted, return null to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <>
      {isTabletOrMobile && (
        <div className="main-mobile">
          {!disableNavbar.includes(pathname) && <NavbarMobileView />}
          <div className="content">{children}</div>
        </div>
      )}
      {isDesktop && (
        <div className="main-desktop">
          {!disableSidebar.includes(pathname) && <Sidebar />}
          <div>
            {!disableNavbar.includes(pathname) && <Navbar />}
            <div className="content">
              <Toaster position="top-right" />
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <style>{dom.css()}</style>
      </Head>
      <body className={lato.className}>
        <SessionProvider>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
