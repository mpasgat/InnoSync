import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavbarWrapper from "./components/navbar/NavbarWrapper";
import "./globals.css";
import AutoRefreshWrapper from "./components/AutoRefreshWrapper";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InnoSync",
  description: "InnoSync",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NavbarWrapper />
        <AutoRefreshWrapper />
        {children}
      </body>
    </html>
  );
}


