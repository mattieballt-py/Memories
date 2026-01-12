import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Splat App",
  description: "3D Gaussian Splatting with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
