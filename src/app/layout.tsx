import type { Metadata } from "next";
import {
  Doppio_One,
  Instrument_Serif,
  Open_Sans,
  Red_Rose,
} from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const doppioOne = Doppio_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nav",
  display: "swap",
});

const redRose = Red_Rose({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ikkoa — Visual Stories in Paint",
  description:
    "ikkoa is the studio of a painter exploring emotion, silence, and form through contemporary canvases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${openSans.variable} ${doppioOne.variable} ${redRose.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
