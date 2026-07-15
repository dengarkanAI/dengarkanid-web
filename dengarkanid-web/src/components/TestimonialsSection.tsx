/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  documentId?: string;
  quote: string;
  name: string;
  role: string | null;
  cardColor: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
  row: 'top' | 'middle' | 'bottom';
  isActive: boolean;
  avatar: {
    url: string;
  } | null;
}

// Fallback data shown when CMS has no entries yet
const FALLBACK: { top: Testimonial[]; bottom: Testimonial[] } = {
  top: [
    {
      id: 1,
      quote: '"Dengarkan memberikan insight yang tidak pernah kami bayangkan sebelumnya. Kami akhirnya benar-benar mendengar pelanggan kami."',
      name: 'Rina Kusuma',
      role: 'Marketing Director',
      cardColor: 'red',
      row: 'top',
      isActive: true,
      avatar: null,
    },
    {
      id: 2,
      quote: '"Platform ini mengubah cara kami memahami sentimen pasar. Data yang akurat, analitik yang tajam."',
      name: 'Budi Santoso',
      role: 'CEO, Tech Startup',
      cardColor: 'orange',
      row: 'top',
      isActive: true,
      avatar: null,
    },
    {
      id: 3,
      quote: '"Kami bisa mendeteksi krisis reputasi sebelum menjadi viral. Dengarkan adalah game-changer untuk tim PR kami."',
      name: 'Sari Dewi',
      role: 'Public Relations Head',
      cardColor: 'yellow',
      row: 'top',
      isActive: true,
      avatar: null,
    },
  ],
  bottom: [
    {
      id: 4,
      quote: '"Kompetitor kami bergerak cepat, tapi dengan Dengarkan kami selalu satu langkah lebih maju."',
      name: 'Agus Wijaya',
      role: 'Brand Manager',
      cardColor: 'green',
      row: 'bottom',
      isActive: true,
      avatar: null,
    },
    {
      id: 5,
      quote: '"ROI yang luar biasa. Dalam 3 bulan, kami bisa mengoptimalkan strategi konten kami berdasarkan data nyata."',
      name: 'Dian Purnama',
      role: 'Digital Strategist',
      cardColor: 'blue',
      row: 'bottom',
      isActive: true,
      avatar: null,
    },
    {
      id: 6,
      quote: '"Fitur analitik sentimen budayanya sangat akurat untuk konteks Indonesia. Tidak ada yang menandingi ini."',
      name: 'Maya Saputri',
      role: 'Social Media Manager',
      cardColor: 'purple',
      row: 'bottom',
      isActive: true,
      avatar: null,
    },
    {
      id: 7,
      quote: '"Tim customer success Dengarkan sangat responsif. Kami merasa benar-benar diperhatikan sebagai klien."',
      name: 'Hendra Lim',
      role: 'Product Manager',
      cardColor: 'red',
      row: 'bottom',
      isActive: true,
      avatar: null,
    },
  ],
};

function TestiCard({ t, strapiUrl }: { t: Testimonial; strapiUrl: string }) {
  const { quote, name, role, cardColor, avatar } = t;

  // Map hardcoded names to their original avatars when no CMS avatar is provided
  // Provide a random-ish consistent avatar for new names
  const getFallbackAvatar = (id: number, name: string) => {
    if (name.includes('Olivia')) return '/assets/headshot-1.jpg';
    if (name.includes('Sophia')) return '/assets/headshot-2.jpg';
    if (name.includes('Aisha')) return '/assets/headshot-3.jpg';
    if (name.includes('Emily')) return '/assets/headshot-4.jpg';
    if (name.includes('Priya')) return '/assets/headshot-5.jpg';
    if (name.includes('Mia')) return '/assets/headshot-2.jpg';

    // Cycle through avatars 1-5 for new entries that don't have avatars uploaded
    const avatarIndex = (id % 5) + 1;
    return `/assets/headshot-${avatarIndex}.jpg`;
  };

  const avatarUrl = avatar?.url
    ? `${strapiUrl}${avatar.url}`
    : getFallbackAvatar(t.id, name);

  return (
    <div className={`testimonial-card color-${cardColor}`}>
      <p className="testi-quote">{quote}</p>
      <div className="testi-user">
        <img src={avatarUrl} alt={name} className="testi-avatar" />
        <div className="testi-meta">
          <h4>{name}</h4>
          {role && <span>{role}</span>}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [topRow, setTopRow] = useState<Testimonial[]>([]);
  const [bottomRow, setBottomRow] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);

  const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          `${STRAPI}/api/testimonials?populate=avatar&filters[isActive][$eq]=true&pagination[pageSize]=50&sort=createdAt:asc`
        );
        if (!res.ok) throw new Error('CMS not available');
        const json = await res.json();
        const items: Testimonial[] = (json.data || []).map((item: any) => ({
          id: item.id,
          ...item.attributes,
          // Fallback if it's already flat (e.g. Strapi v5)
          ...(item.attributes ? {} : item)
        }));

        if (items.length === 0) throw new Error('No testimonials in CMS');

        setTopRow(items.filter((t) => t.row === 'top'));
        setBottomRow(items.filter((t) => t.row === 'bottom' || t.row === 'middle'));
        setLoaded(true);
      } catch {
        // Use fallback data
        setTopRow(FALLBACK.top);
        setBottomRow(FALLBACK.bottom);
        setLoaded(true);
      }
    };
    fetchTestimonials();
  }, [STRAPI]);

  if (!loaded) return null;

  return (
    <section className="testimonials-section-new">
      <div className="testimonials-header text-center">
        <h2>What people are saying?</h2>
        <p className="text-muted">
          Don&apos;t just take our word for it—see what our customers have to say about their experience!
        </p>
      </div>

      <div className="testimonials-marquee-wrapper">
        {/* Row 1 — scrolls left */}
        <div className="marquee-row marquee-left">
          <div className="marquee-track">
            {/* Render twice for seamless loop */}
            {[...topRow, ...topRow].map((t, i) => (
              <TestiCard key={`top-${t.id}-${i}`} t={t} strapiUrl={STRAPI} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="marquee-row marquee-right">
          <div className="marquee-track">
            {[...bottomRow, ...bottomRow].map((t, i) => (
              <TestiCard key={`bot-${t.id}-${i}`} t={t} strapiUrl={STRAPI} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
