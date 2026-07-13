import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ScrollObserver from "@/components/ui/ScrollObserver";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dengarkan.id'),
  title: {
    default: "Dengarkan.id - Transform Conversations into Actionable Intelligence",
    template: "%s | Dengarkan.id"
  },
  description: "Monitor conversations across social media and digital channels with AI-powered insights. Transform your brand's data into actionable intelligence with Dengarkan.id.",
  keywords: ["social media listening", "brand monitoring", "AI insights", "digital channels", "dengarkan.id", "sentiment analysis", "social listening indonesia"],
  authors: [{ name: "Dengarkan.id" }],
  creator: "Dengarkan.id",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Dengarkan.id",
    title: "Dengarkan.id - Transform Conversations into Actionable Intelligence",
    description: "Monitor conversations across social media and digital channels with AI-powered insights. Transform your brand's data into actionable intelligence with Dengarkan.id.",
    images: [
      {
        url: "/logo-dengarkan-listening-tools.png",
        width: 1200,
        height: 630,
        alt: "Dengarkan.id Social Listening Tool",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dengarkan_id",
    creator: "@dengarkan_id",
    title: "Dengarkan.id - Transform Conversations into Actionable Intelligence",
    description: "Monitor conversations across social media and digital channels with AI-powered insights. Transform your brand's data into actionable intelligence with Dengarkan.id.",
    images: ["/logo-dengarkan-listening-tools.png"],
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
    <html lang="id">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: `
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Dengarkan.id",
          "url": "https://dengarkan.id/",
          "logo": "https://dengarkan.id/logo-dengarkan-listening-tools.png"
        }
        `}} />
      </head>
      <body className={inter.className}>
        <ScrollObserver />
        {children}
        <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" strategy="beforeInteractive" />
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
