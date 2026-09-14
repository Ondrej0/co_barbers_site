import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),

  title: {
    default: "North & Co. | Gloucester Barbers",
    template: "%s | North & Co. | Gloucester Barbers",
  },
  description:
    "Sharp cuts, clean fades and a relaxed barbershop experience in Gloucester. Explore our services, meet the barbers and book your next visit to North & Co.",
  openGraph: {
    siteName: "North & Co. Barbers",
    type: "website",
    locale: "en_GB",
    title: "North & Co. | Gloucester Barbers",
    description:
        "Sharp cuts, clean fades and a relaxed barbershop experience in Gloucester.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="btn btn-brass fixed left-4 top-4 z-50 -translate-y-32 focus:translate-y-0"
        >
          Skip to content
        </a>
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus:outline-none"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
