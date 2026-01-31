import type { Metadata } from "next";
import { Geist, Geist_Mono, Bayon } from "next/font/google";
import "./globals.css";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bayon = Bayon({
  weight: "400",
  variable: "--font-bayon",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memories - 1 Photo → 3D Point Cloud",
  description: "Transform a single photo into an interactive 3D Gaussian splat point cloud",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PB1WGHVZNE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PB1WGHVZNE');
          `}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bayon.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
