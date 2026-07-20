import type { Metadata } from "next";
import { Inter, Manrope, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { getValidUrl } from "@/lib/urls";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getValidUrl(process.env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Westbal Consulting | Punësim dhe Vizë në Gjermani",
    template: "%s | Westbal Consulting",
  },
  description:
    "Konsultim premium për relokim në Gjermani: punësim, vizë, dokumentacion dhe leje qëndrimi me proces transparent.",
  openGraph: {
    type: "website",
    locale: "sq_AL",
    siteName: "Westbal Consulting",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sq"
      className={`${inter.variable} ${manrope.variable} ${playfair.variable} ${spaceGrotesk.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-white text-[#0F172A] antialiased [font-family:var(--font-body)]"
        suppressHydrationWarning
      >
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
