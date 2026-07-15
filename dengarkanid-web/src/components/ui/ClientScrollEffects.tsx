'use client';

import { useEffect } from 'react';

export default function ClientScrollEffects() {
    useEffect(() => {
        // Sticky Navbar & Scroll Progress
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar-new') as HTMLElement;
            const progress = document.querySelector('.scroll-progress-bar') as HTMLElement;
            if (navbar) {
                if (window.scrollY > 20) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            if (progress) {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                progress.style.width = scrolled + "%";
            }
        };
        window.addEventListener('scroll', handleScroll);

        // Scroll Fade Animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));

        // Logo Carousel Interval
        const track = document.getElementById('logo-track');
        let logoInterval: ReturnType<typeof setInterval>;
        if (track && track.children.length > 0) {
            const totalItems = track.children.length;
            const halfItems = totalItems / 2;
            let currentIndex = 0;

            logoInterval = setInterval(() => {
                currentIndex++;

                // Smooth slide to the next item
                track.style.transition = 'transform 0.8s ease-in-out';

                const firstItem = track.children[0] as HTMLElement;
                const itemWidth = firstItem.getBoundingClientRect().width;
                const style = window.getComputedStyle(track);
                const gap = parseFloat(style.gap || style.columnGap || '0');
                const stepSize = itemWidth + gap;

                track.style.transform = `translateX(-${currentIndex * stepSize}px)`;

                if (currentIndex >= halfItems) {
                    setTimeout(() => {
                        track.style.transition = 'none';
                        currentIndex = 0;
                        track.style.transform = 'translateX(0)';
                    }, 800);
                }
            }, 4000);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
            if (logoInterval) clearInterval(logoInterval);
        };
    }, []);

    return null;
}
