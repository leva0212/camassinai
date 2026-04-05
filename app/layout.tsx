import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PlasmicProvider from "@/components/PlasmicProvider";
import { MantineProvider } from "@mantine/core"; // MantineProvider sin withGlobalStyles ni withNormalizeCSS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Camas Sinai ERP",
  description: "Sistema de inventario",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* MantineProvider simple */}
        <MantineProvider>
          <PlasmicProvider>{children}</PlasmicProvider>
        </MantineProvider>
      </body>
    </html>
  );
}