import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ScrollReveal from "@/components/ui/ScrollReveal";

/* ================= FONTS ================= */

const luckiest = localFont({
  src: "./fonts/luckiestguy.ttf",
  variable: "--font-luckiest",
  display: "swap",
});

const crayon = localFont({
  src: "./fonts/DKCrayonCrumble.ttf",
  variable: "--font-crayon",
  display: "swap",
});

const madinah = localFont({
  src: "./fonts/Madinah.otf",
  variable: "--font-madinah",
  display: "swap",
});

/* ================= METADATA ================= */

const siteName = "11º ENJC";
const siteTitle = "11º ENJC | Inscreva-se";
const description =
  "Inscrições abertas para o 11º ENJC! Um encontro jovem, alegre e cheio de fé. Vem com a gente! 🙏💛";

export const metadata: Metadata = {
  metadataBase: new URL("https://11-enjc.vercel.app"),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description,
  openGraph: {
    type: "website",
    url: "/",
    title: siteTitle,
    description,
    siteName,
    locale: "pt_BR",
    images: [
      {
        url: "/og/cover.png",
        width: 1200,
        height: 630,
        alt: "11º ENJC - Capa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description,
    images: ["/og/cover.png"],
  },
};

/* ================= THEMECOLOR ================= */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F29500", // ajuste para sua cor principal
};

/* ================= LAYOUT ================= */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${luckiest.variable} ${crayon.variable} ${madinah.variable}`}
      >
        {/* Scroll Reveal Global */}
        <ScrollReveal selector="[data-reveal]" />

        {children}
      </body>
    </html>
  );
}
