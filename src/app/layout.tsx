import type { Metadata } from "next";
import { Archivo_Narrow, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "07 Garage",
  description: "Precision workshop specializing in cafe racers and performance tuning. Engineered for those who ride with intent.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${archivoNarrow.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} min-h-screen bg-surface text-on-surface antialiased`}
      >
        {children}
      </body>
    </html>
  );
}