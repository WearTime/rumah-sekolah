"use client";

import { Lato } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { notFound, usePathname } from "next/navigation";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config, dom, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const disableNavbar = ["/login", "/register", "/404"];
const disableSidebar = ["/login", "/register"];

library.add(fas);
config.autoAddCss = false;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <html lang="en">
      <Head>
        <style>{dom.css()}</style>
      </Head>
      <body className={lato.className}>
        <SessionProvider>
          <div className="main">
            {isTabletOrMobile && <Navbar />}
            {!disableSidebar.includes(pathname) && <Sidebar />}
            <div>
              {!disableNavbar.includes(pathname) && <Navbar />}
              <div className="content">
                <Toaster position="top-right" />
                {children}
              </div>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
