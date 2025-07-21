import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Optional: metadata Next.js (masih bisa dipakai jika ingin)
export const metadata = {
  title: "kannohouse",
  icons: {
    icon: '/favicon-v2.ico',
  },
  description: "Website portfolio kannohouse",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Tambahkan tag favicon manual */}
        <link rel="icon" href="/favicon-v2.ico" type="ico" />
        <title>kannohouse</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
