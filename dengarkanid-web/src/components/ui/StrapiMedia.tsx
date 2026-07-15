import React from 'react';
import Image from 'next/image';
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

    let w = 800;
    let h = 600;
    if (imageObj?.width) {
        w = imageObj.width;
        h = imageObj.height;
    } else if (imageObj?.data?.attributes?.width) {
        w = imageObj.data.attributes.width;
        h = imageObj.data.attributes.height;
    } else if (imageObj?.data?.width) {
        w = imageObj.data.width;
        h = imageObj.data.height;
    }

    return (
        <Image 
            id={id} 
            src={url} 
            alt={alt || ""} 
            width={w} 
            height={h}
            className={className} 
            style={{ width: '100%', height: 'auto', ...style }} 
        />
    );
}
