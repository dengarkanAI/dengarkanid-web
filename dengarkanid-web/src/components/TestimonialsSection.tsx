/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  attributes: {
    quote: string;
    name: string;
    location: string | null;
    cardColor: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
    row: 'top' | 'middle' | 'bottom';
    isActive: boolean;
    avatar: {
      data: {
        attributes: {
          url: string;
        };
      } | null;
    };
  };
}

// Fallback data shown when CMS has no entries yet
const FALLBACK: { top: Testimonial[]; bottom: Testimonial[] } = {
  top: [
    {
      id: 1,
      attributes: {
        quote: '"Dengarkan memberikan insight yang tidak pernah kami bayangkan sebelumnya. Kami akhirnya benar-benar mendengar pelanggan kami."',
        name: 'Rina Kusuma',
        location: 'Jakarta, Indonesia',
        cardColor: 'red',
        row: 'top',
        isActive: true,
        avatar: { data: null },
      },
    },
    {
      id: 2,
      attributes: {
        quote: '"Platform ini mengubah cara kami memahami sentimen pasar. Data yang akurat, analitik yang tajam."',
        name: 'Budi Santoso',
        location: 'Surabaya, Indonesia',
        cardColor: 'orange',
        row: 'top',
        isActive: true,
        avatar: { data: null },
      },
    },
    {
      id: 3,
      attributes: {
        quote: '"Kami bisa mendeteksi krisis reputasi sebelum menjadi viral. Dengarkan adalah game-changer untuk tim PR kami."',
        name: 'Sari Dewi',
        location: 'Bandung, Indonesia',
        cardColor: 'yellow',
        row: 'top',
        isActive: true,
        avatar: { data: null },
      },
    },
  ],
  bottom: [
    {
      id: 4,
      attributes: {
        quote: '"Kompetitor kami bergerak cepat, tapi dengan Dengarkan kami selalu satu langkah lebih maju."',
        name: 'Agus Wijaya',
        location: 'Medan, Indonesia',
        cardColor: 'green',
        row: 'bottom',
        isActive: true,
        avatar: { data: null },
      },
    },
    {
      id: 5,
      attributes: {
        quote: '"ROI yang luar biasa. Dalam 3 bulan, kami bisa mengoptimalkan strategi konten kami berdasarkan data nyata."',
        name: 'Dian Purnama',
        location: 'Yogyakarta, Indonesia',
        cardColor: 'blue',
        row: 'bottom',
        isActive: true,
        avatar: { data: null },
      },
    },
    {
      id: 6,
      attributes: {
        quote: '"Fitur analitik sentimen budayanya sangat akurat untuk konteks Indonesia. Tidak ada yang menandingi ini."',
        name: 'Maya Saputri',
        location: 'Makassar, Indonesia',
        cardColor: 'purple',
        row: 'bottom',
        isActive: true,
        avatar: { data: null },
      },
    },
    {
      id: 7,
      attributes: {
        quote: '"Tim customer success Dengarkan sangat responsif. Kami merasa benar-benar diperhatikan sebagai klien."',
        name: 'Hendra Lim',
        location: 'Bali, Indonesia',
        cardColor: 'red',
        row: 'bottom',
        isActive: true,
        avatar: { data: null },
      },
    },
  ],
};

function TestiCard({ t, strapiUrl }: { t: Testimonial; strapiUrl: string }) {
  const { quote, name, location, cardColor, avatar } = t.attributes;
  const avatarUrl = avatar?.data?.attributes?.url
    ? `${strapiUrl}${avatar.data.attributes.url}`
    : `/assets/headshot-1.jpg`;

  return (
    <div className={`testimonial-card color-${cardColor}`}>
      <p className="testi-quote">{quote}</p>
      <div className="testi-user">
        <img src={avatarUrl} alt={name} className="testi-avatar" />
        <div className="testi-meta">
          <h4>{name}</h4>
          {location && <span>{location}</span>}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [topRow, setTopRow] = useState<Testimonial[]>([]);
  const [bottomRow, setBottomRow] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);

  const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          `${STRAPI}/api/testimonials?populate=avatar&filters[isActive][$eq]=true&pagination[pageSize]=50&sort=createdAt:asc`
        );
        if (!res.ok) throw new Error('CMS not available');
        const json = await res.json();
        const items: Testimonial[] = json.data || [];

        if (items.length === 0) throw new Error('No testimonials in CMS');

        setTopRow(items.filter((t) => t.attributes.row === 'top'));
        setBottomRow(items.filter((t) => t.attributes.row === 'bottom' || t.attributes.row === 'middle'));
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
    <section className="testimonials-section-new scroll-fade">
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
