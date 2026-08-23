import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Articles - Dengarkan.id",
  description: "Temukan panduan praktis, riset pasar terbaru, dan analisis mendalam untuk memahami pelanggan Anda lebih baik.",
  openGraph: {
    title: "Articles - Dengarkan.id Insights",
    description: "Panduan praktis dan riset pasar terbaru untuk memahami percakapan media sosial.",
  }
};

export default function ArtikelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
