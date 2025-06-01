import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import StoreProvider from "@/providers/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import NuqsProvider from "@/providers/NuqsProvider";
import { Navbar } from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import NextAuthProvider from "@/providers/NextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bubblify Laundry - Layanan Laundry Terpercaya",
  description:
    "Bubblify Laundry menyediakan layanan cuci, setrika, dan dry cleaning berkualitas tinggi dengan harga terjangkau. Nikmati kemudahan layanan antar-jemput dan hasil yang bersih sempurna.",
  keywords: "laundry, cuci baju, setrika, dry cleaning, antar jemput, Bubblify",
  authors: [{ name: "Bubblify Laundry Team" }],
  creator: "Bubblify Laundry",
  publisher: "Bubblify Laundry",
  openGraph: {
    title: "Bubblify Laundry - Layanan Laundry Terpercaya",
    description:
      "Layanan laundry profesional dengan kualitas terbaik dan harga terjangkau",
    type: "website",
    locale: "id_ID",
    siteName: "Bubblify Laundry",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bubblify Laundry - Layanan Laundry Terpercaya",
    description:
      "Layanan laundry profesional dengan kualitas terbaik dan harga terjangkau",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  category: "business",
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};
export default HomeLayout;
