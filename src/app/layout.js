import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { ThemeProvider } from "../contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "Obligate Solutions - Transform Vision into Delivery",
  description: "Transform ideas into production-grade digital products with a delivery partner that makes execution non-negotiable. ISO certified, secure development, 24/7 support.",
  keywords: "software development, digital products, web development, mobile apps, cloud solutions, AI development, custom software",
  authors: [{ name: "Obligate Solutions" }],
  openGraph: {
    title: "Obligate Solutions - Transform Vision into Delivery",
    description: "Transform ideas into production-grade digital products with a delivery partner that makes execution non-negotiable.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    // Add verification codes when available
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
