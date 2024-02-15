import type { Metadata } from "next";
import {
  Poppins,
  Playfair_Display,
  Kanit,
  Nunito,
  Montserrat,
} from "next/font/google";
import "./globals.css";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`overflow-hidden ${poppins.variable} ${kanit.variable} ${playFair.variable} ${montserrat.variable}`}
    >
      <body className={`w-full h-full  bg-zinc-900 overflow-x-hidden  ${nunito.className}`}>
        <main className="w-full h-screen  ">{children}</main>
      </body>
    </html>
  );
}
