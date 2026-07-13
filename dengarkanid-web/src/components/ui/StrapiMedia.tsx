import React from 'react';
import { getStrapiImageUrl } from '@/utils/strapi';

interface StrapiMediaProps {
    imageObj: any;
    fallbackUrl?: string;
    alt?: string;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}

export default function StrapiMedia({ imageObj, fallbackUrl, alt, className, id, style }: StrapiMediaProps) {
    const url = getStrapiImageUrl(imageObj) || fallbackUrl;

    if (!url) return null;

    const isLottie = url.endsWith('.json') || url.endsWith('.txt');

    if (isLottie) {
        return React.createElement('lottie-player', {
            id: id,
            src: url,
            background: "transparent",
            speed: "1",
            style: { width: '100%', maxHeight: '500px', objectFit: 'contain', ...style },
            loop: true,
            autoplay: true,
            className: className
        });
    }

    return <img id={id} src={url} alt={alt || ""} className={className} style={style} />;
}
