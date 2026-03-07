import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display-custom",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

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
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <body className="bg-surface-primary text-white antialiased">
        {children}
      </body>
    </html>
  );
}
