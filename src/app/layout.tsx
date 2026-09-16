import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteConfig.businessName} | Lands, Houses & Properties in Dindigul`,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: `${siteConfig.heroSubheading} ${siteConfig.taglineTamil}`,
  keywords: [
    "BVS Real Estate",
    "Real Estate Dindigul",
    "Lands for sale Dindigul",
    "Plots Dindigul",
    "House for sale Dindigul",
    "Agricultural land Dindigul",
    "Commercial property Dindigul",
    "East Govindapuram Dindigul",
    "Aavin Palpannai Real Estate",
    "Banumathi B BVS Real Estate",
  ],
  authors: [{ name: siteConfig.contactPerson }],
  creator: siteConfig.businessName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    title: `${siteConfig.businessName} | Dindigul Real Estate`,
    description: `${siteConfig.heroSubheading} Direct contact: ${siteConfig.phone}`,
    siteName: siteConfig.businessName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.businessName} | Real Estate Dindigul`,
    description: `${siteConfig.heroSubheading} Call: ${siteConfig.phone}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1D3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-gold-200 selection:text-navy-950 font-sans pb-20 sm:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
