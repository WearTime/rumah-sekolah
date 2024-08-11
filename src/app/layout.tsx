"use client";

import { Lato } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { usePathname } from "next/navigation";
import "@fortawesome/fontawesome-svg-core/styles.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const disableNavbar = ["/login", "/register"];
const disableSidebar = ["/login", "/register"];

import { config, dom, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";

library.add(fas);
config.autoAddCss = false;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <Head>
        <style>{dom.css()}</style>
      </Head>
      <body className={lato.className}>
        <SessionProvider>
          <div className="main">
            {!disableNavbar.includes(pathname) && <Sidebar />}
            <div>
              {!disableNavbar.includes(pathname) && <Navbar />}
              {children}
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
