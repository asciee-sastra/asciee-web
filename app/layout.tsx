import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Main/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASCIEE",
  description: "Offical Site of ASCIEE",
  icons: {
    icon: "/public/asciee.jpg"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a0020" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased bg-gradient-to-br md:bg-gradient-to-r from-[#0a0a0a] to-[#2b0b33]`}
        
      >
        {children}
        
      </body>
      <Footer />
    </html>
  );
}
