import type { Metadata } from "next";
import {
  Poppins,
  Playfair_Display,
  Kanit,
  Nunito,
  Montserrat,
} from "next/font/google";
import "./globals.css";
import Provider from "@/context/Provider";
import UnderBar from "../components/underBar/underBar";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";

import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import Sidebar from "@/components/sidebar/Sidebar";
import TempOverlay from "@/components/ui/TempOverlay";

const nunito = Nunito({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const playFair = Playfair_Display({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-playFair",
});

const kanit = Kanit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "zTunes",
  description: "A music website",
};

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: never;
}>) {
  return (
    <html
      lang="en"
      className={`overflow-hidden ${poppins.variable} ${kanit.variable} ${playFair.variable} ${montserrat.variable}`}
    >
      <head>
        <link rel="shortcut icon" href="#" />
      </head>
      <Provider session={session}>
        <body
          className={`w-full h-full text-white  bg-black-700 overflow-x-hidden ${nunito.className}`}
        >
          <ToastContainer
            autoClose={3000}
            theme="dark"
            position="bottom-center"
          />
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <div className="w-full h-screen">
              <TempOverlay />
              <Sidebar />
              {children}
            </div>
          </SkeletonTheme>
          <UnderBar />
        </body>
      </Provider>
    </html>
  );
}
