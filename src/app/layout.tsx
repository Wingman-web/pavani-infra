import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-custom",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pavani Infra | Premier Real Estate Developers",
  description:
    "A legacy of excellence since 1995. Premium residential and commercial projects across Hyderabad, Bangalore, Chennai, Vijayawada, and Nellore.",
  keywords: [
    "Pavani Infra",
    "real estate",
    "luxury apartments",
    "Hyderabad",
    "Bangalore",
    "Chennai",
    "premium living",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrains.variable}`}>
      <body className="bg-[#FAFAFA] text-[#0e1a26] antialiased">
        {children}
      </body>
    </html>
  );
}
