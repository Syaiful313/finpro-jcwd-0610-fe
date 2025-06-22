import { manrope } from "@/assets/font";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/providers/NextAuthProvider";
import NuqsProvider from "@/providers/NuqsProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import StoreProvider from "@/providers/StoreProvider";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.className} antialiased`}>
        <StoreProvider>
          <ReactQueryProvider>
            <NuqsProvider>
              <NextAuthProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem
                >
                  {children}
                </ThemeProvider>
              </NextAuthProvider>
            </NuqsProvider>
          </ReactQueryProvider>
        </StoreProvider>
        <Toaster position="top-right" duration={2000} />
      </body>
    </html>
  );
}
