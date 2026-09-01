import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brianmuema.com"),
  title: "Brian Muema | Data Analyst & Data Scientist",
  description: "Portfolio of Brian Muema, Data Analyst turning data into insights, insights into decisions. Specializing in Python, SQL, and Machine Learning.",
  openGraph: {
    title: "Brian Muema | Data Analyst & Data Scientist",
    description: "Portfolio of Brian Muema, Data Analyst turning data into insights, insights into decisions.",
    url: "https://brianmuema.com",
    siteName: "Brian Muema Portfolio",
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 800,
        alt: "Brian Muema",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brian Muema | Data Analyst",
    description: "Data Analyst turning data into insights, insights into decisions.",
    images: ["/profile.jpg"],
  },
  alternates: {
    canonical: "https://brianmuema.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
