import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import ScrollObserver from "@/components/ui/ScrollObserver";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

import { getGlobalSettings } from "@/utils/strapi";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  // Fetch global settings
  let globalSettings: any = null;
  try {
    globalSettings = await getGlobalSettings(locale);
  } catch (err) {
    console.error("Error fetching global-setting for metadata:", err);
  }

  const defaultTitle = "Dengarkan.id - Transform Conversations into Actionable Intelligence";
  const defaultDesc = "Monitor conversations across social media and digital channels with AI-powered insights. Transform your brand's data into actionable intelligence with Dengarkan.id.";
  
  const seoTitle = globalSettings?.seoTitle || defaultTitle;
  const seoDesc = globalSettings?.seoDescription || defaultDesc;
  const faviconUrl = globalSettings?.favicon?.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${globalSettings.favicon.url}` : '/favicon.ico';

  return {
    metadataBase: new URL('https://dengarkan.id'),
    title: {
      default: seoTitle,
      template: "%s | Dengarkan.id"
    },
    description: seoDesc,
    keywords: ["social media listening", "brand monitoring", "AI insights", "digital channels", "dengarkan.id", "sentiment analysis", "social listening indonesia"],
    authors: [{ name: "Dengarkan.id" }],
    creator: "Dengarkan.id",
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "Dengarkan.id",
      title: seoTitle,
      description: seoDesc,
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
      title: seoTitle,
      description: seoDesc,
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
}

import { GoogleOAuthProvider } from '@react-oauth/google';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale}>
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
        <GoogleOAuthProvider clientId="70871060452-onejag4o3lrtq23lsc3tn0b28osp6lts.apps.googleusercontent.com">
          <ScrollObserver />
          {children}
          <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" strategy="beforeInteractive" />
          <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
          {/* Google Analytics */}
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-74VVKG046M" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-74VVKG046M');
            `}
          </Script>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
