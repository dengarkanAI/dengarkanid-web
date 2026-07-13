import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Glosarium - Dengarkan.id",
  description: "Kamus istilah lengkap tentang Social Media Listening, Analytics, dan Brand Strategy.",
  openGraph: {
    title: "Glosarium - Dengarkan.id",
    description: "Kamus istilah lengkap tentang Social Media Listening, Analytics, dan Brand Strategy.",
  }
};

export default function GlosariLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
