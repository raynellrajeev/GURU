import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GURU - Your AI Yoga Assistant",
  description:
    "A  Yoga chatbot based on the book 'Yoga Mudras for Physical and Mental Healthcare' written by Dr.S.N. Kumar and Dr.A.Jaiganesh. Offering personalized guidance on asanas, meditation, and wellness. Find balance, flexibility, and mindfulness anytime, anywhere.",
  keywords:
    "yoga, meditation, wellness, AI chatbot, personalized guidance, mindfulness, yoga poses, health",
  authors: [{ name: "Raynell Rajeev" }], 
  robots: "index, follow",   
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
