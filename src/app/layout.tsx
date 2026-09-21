import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartShop | AI Fashion & Styling Assistant",
  description:
    "AI-powered styling companion for Indian Gen Z & Millennials. Instant curated lookbooks for weddings, vacations, and aesthetic gifting with 1-tap outbound links.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen antialiased selection:bg-orange-500 selection:text-white">
        {/* Desktop ambient wrapper to provide a mobile app feel */}
        <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 flex justify-center">
          <main className="w-full max-w-md min-h-screen flex flex-col bg-neutral-900/90 border-x border-neutral-800 shadow-2xl relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
