import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Liigadoku",
  description:
    "Liigadoku.com on kotimaiseen jääkiekon Liigaan perustuva sudoku-peli. Löydä pelaaja, joka on pelannut molemmissa ruudun joukkueissa! Voit haastaa ystäväsi peliin jakamalla tuloksesi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="pageContainer">
      <head>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      </head>

      <body
        className={inter.className}
        style={{ height: "100%", width: "100%" }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
