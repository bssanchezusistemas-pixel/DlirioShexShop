import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const heroDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hero-display",
});

const heroSans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-hero-sans",
});

export const metadata: Metadata = {
  title: "Delirio X Sex Shop | Zarzal, Valle del Cauca",
  description:
    "Tienda erótica en Zarzal. Juguetes, lencería, cosméticos íntimos SEN ÍNTIMO. Domicilios gratis. Pedidos por WhatsApp.",
  keywords: [
    "sex shop",
    "tienda erótica",
    "Zarzal",
    "Delirio X",
    "SEN ÍNTIMO",
    "domicilios",
  ],
  openGraph: {
    title: "Delirio X Sex Shop",
    description:
      "El arte del amor y el placer en un solo lugar. Domicilios gratis en Zarzal.",
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`grain antialiased ${heroDisplay.variable} ${heroSans.variable}`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
