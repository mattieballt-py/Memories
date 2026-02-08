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
  title: "Photo to 3D Scene: Create Worlds from One Image Free | Timeless Mind",
  description: "Turn any photo into an interactive 3D scene instantly. Create shareable gaussian splat 3D memories from a single image. Free online tool - no signup required.",
  keywords: "photo to 3D scene, image to 3D, gaussian splat from photo, create 3D memories online, one photo 3D world, turn photo into 3D model, free 3D scene creator",
  authors: [{ name: "Timeless Mind" }],
  openGraph: {
    title: "Photo to 3D Scene: Create Worlds from One Image Free",
    description: "Transform a single photo into an interactive 3D gaussian splat scene. Share your memories in immersive 3D.",
    type: "website",
    siteName: "Timeless Mind",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo to 3D Scene: Create Worlds from One Image Free",
    description: "Turn any photo into an interactive 3D scene instantly. Free online tool.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
