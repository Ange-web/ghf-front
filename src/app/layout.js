import { Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ClientLayout } from "./client-layout";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

// Clash Display loaded locally fallback — or use variable if available
// Since Clash Display isn't on Google Fonts, we keep the CSS @import for it
// but use next/font for the primary font (Outfit)

export const metadata = {
  title: {
    template: "%s | GHF Agency",
    default: "GHF Agency | Experience the Night",
  },
  description:
    "L'agence événementielle qui transforme vos nuits en expériences inoubliables. Soirées VIP, concerts, expériences uniques à Paris.",
  keywords: ["événements", "soirées", "VIP", "Paris", "nightlife", "concerts", "GHF Agency"],
  authors: [{ name: "GHF Agency" }],
  openGraph: {
    title: "GHF Agency | Experience the Night",
    description: "L'agence événementielle qui transforme vos nuits en expériences inoubliables.",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={outfit.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={outfit.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
