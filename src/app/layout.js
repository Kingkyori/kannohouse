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

export const metadata = {
  title: "kannohouse",
  description: "Website portfolio kannohouse",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Tambahkan secara manual favicon agar tidak pakai default Vercel */}
        <link rel="icon" href="/favicon-kanno.ico" type="image/x-icon" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Website portfolio kannohouse" />
        <meta property="og:title" content="kannohouse" />
        <meta property="og:description" content="Website portfolio kannohouse" />
        <meta property="og:image" content="/favicon-v2.ico" />
        <meta property="og:url" content="https://kannohouse.site" />
        <title>kannohouse</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
