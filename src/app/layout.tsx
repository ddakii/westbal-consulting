import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { getValidUrl } from "@/lib/urls";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
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
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className={`${manrope.className} min-h-full bg-white text-base font-semibold leading-relaxed tracking-tight text-[#0F172A] antialiased`}
        suppressHydrationWarning
      >
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
