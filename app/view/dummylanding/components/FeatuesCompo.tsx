"use client"

import { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { cn } from '../../../lib/utils'

// The cards array with proper categorization
type CardItem = {
  src: string;
  title: string;
  category: 'Image Generation' | 'Video Generation' | 'Branding Kit' | 'Audio Generation' | 'Filming Tools' | '3D Generation';
  col: number;
  row: number;
  fit?: 'cover' | 'contain';
  containerClassName?: string;
  imgClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
};
const cards: CardItem[] = [
  // Image Generation
  { src: '/Landingpage/features/text to image.png', title: 'Text to Image', category: 'Image Generation', col: 1, row: 3, fit:'cover' },
  { src: '/Landingpage/features/image to image.png', title: 'Image to Image', category: 'Image Generation', col: 1, row: 2, fit:'cover' },
  { src: '/Landingpage/features/sticker.png', title: 'Sticker Generation', category: 'Image Generation', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/character gen.png', title: 'Character Generation', category: 'Image Generation', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/chatracter swap.png', title: 'Character Swap', category: 'Image Generation', col: 1, row: 3 },
  { src: '/Landingpage/features/in paint.png', title: 'Inpaint', category: 'Image Generation', col: 2, row: 2 },
  { src: '/Landingpage/features/live portrtait.png', title: 'Live Portrait', category: 'Image Generation', col: 1, row: 2, fit:'cover' },
  { src: '/Landingpage/features/facial expe.png', title: 'Facial Expression', category: 'Image Generation', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/image upscale.png', title: 'Image Upscale', category: 'Image Generation', col: 1, row: 2, fit:'cover' },
  { src: '/Landingpage/features/background remo.png', title: 'Remove Background', category: 'Image Generation', col: 1, row: 2, fit:'cover' },

  // Branding Kit
  { src: '/Landingpage/features/logo generation.png', title: 'Logo Generation', category: 'Branding Kit', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/prouct display.png', title: 'Product Display', category: 'Branding Kit', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/mockup.png', title: 'Mockup Generation', category: 'Branding Kit', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/Product with Models.png', title: 'Product with Models', category: 'Branding Kit', col: 2, row: 5, fit:'cover' },

  // Video Generation
  { src: '/Landingpage/features/text to video.png', title: 'Text to Video', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/image to video.png', title: 'Image to Video', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/face swap.png', title: 'Face Swap', category: 'Video Generation', col: 1, row: 2, fit:'cover' },
  { src: '/Landingpage/features/charcater swap.png', title: 'Character Swap', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/vfx.png', title: 'VFX', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/video enhancement.png', title: 'Video Enhancement', category: 'Video Generation', col: 1, row: 2, fit:'cover' },

  // Audio Generation
  { src: '/Landingpage/features/text to music.png', title: 'Text to Music', category: 'Audio Generation', col: 2, row: 4, fit:'cover' },
  { src: '/Landingpage/features/audio to music.png', title: 'Audio to Music', category: 'Audio Generation', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/lyrics to music.png', title: 'Lyrics to Music', category: 'Audio Generation', col: 2, row: 4, fit:'cover' },

  // Filming Tools
  { src: '/Landingpage/features/storyboard.png', title: 'Storyboard', category: 'Filming Tools', col: 2, row: 2, fit:'cover' },
  { src: '/Landingpage/features/film generation.png', title: 'Film Generation', category: 'Filming Tools', col: 2, row: 3, fit:'cover' },
  { src: '/Landingpage/features/comic generation.png', title: 'Comic Generation', category: 'Filming Tools', col: 2, row: 2, fit:'cover' },

  // 3D Generation
  { src: '/Landingpage/features/textto3d.png', title: 'Text to 3D', category: '3D Generation', col: 2, row: 2 },
  { src: '/Landingpage/features/text to 3d.png', title: 'Image to 3D', category: '3D Generation', col: 2, row: 2, fit:'cover' },
];

interface AiToolsGridProps {
  activeCategory?: string;
}

export default function AiToolsGrid({ activeCategory = 'All' }: AiToolsGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverRect, setHoverRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [showAll, setShowAll] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const smoothScrollTo = (targetY: number, duration = 1200) => {
    const startY = window.scrollY || window.pageYOffset;
    const change = targetY - startY;
    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      window.scrollTo(0, startY + change * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  
  // Filter cards based on active category (robust, category-based)
  const filteredCards = activeCategory === 'All'
    ? cards
    : cards.filter(card => card.category === activeCategory);
  
  const visibleCards = showAll ? filteredCards : filteredCards.slice(0, 9);

  return (
    <div ref={containerRef} className="w-full max-w-[1300px] rounded-3xl p-10 overflow-hidden bg-gradient-to-br via-transparent to-transparent mx-auto mb:p-4">
      <div className="w-full h-full">
        <LayoutGroup id="hover-cards">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="relative grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 py-10 mb:gap-3 mb:py-6"
            ref={gridRef}
          >
            {visibleCards.map((card, idx) => (
              <a
                href="#"
                key={card.title + idx}
                className="relative group block p-2 h-full w-full mb:p-1.5"
                onMouseEnter={(e) => {
                  setHoveredIndex(idx);
                  const container = gridRef.current;
                  if (container) {
                    const cardRect = (e.currentTarget as HTMLAnchorElement).getBoundingClientRect();
                    const contRect = container.getBoundingClientRect();
                    setHoverRect({
                      top: cardRect.top - contRect.top,
                      left: cardRect.left - contRect.left,
                      width: cardRect.width,
                      height: cardRect.height,
                    });
                  }
                }}
                onMouseMove={(e) => {
                  if (hoveredIndex !== idx) return;
                  const container = gridRef.current;
                  if (container) {
                    const cardRect = (e.currentTarget as HTMLAnchorElement).getBoundingClientRect();
                    const contRect = container.getBoundingClientRect();
                    setHoverRect(() => ({
                      top: cardRect.top - contRect.top,
                      left: cardRect.left - contRect.left,
                      width: cardRect.width,
                      height: cardRect.height,
                    }));
                  }
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                }}
              >
                <div className={cn('rounded-2xl h-full w-full overflow-hidden bg-black relative z-20')}>
                  <div className="relative w-full h-72 md:h-72 mb:h-44">
                    <Image
                      src={card.src}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1440px) 33vw, (min-width: 768px) 50vw, 100vw"
                      priority={idx < 10}
                    />
                  </div>
                  {/* Left-side gradient for readability */}
                  <div className="pointer-events-none absolute inset-y-0 top-0 left-0 w-[80%] bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10" />
                  {/* Left-side text on top-left */}
                  <div className="absolute top-0 left-0 w-[45%] md:w-[45%] z-20 flex items-start justify-start mb:w-[60%]">
                    <div className="px-6 py-4 md:px-6 md:py-4 mb:px-3 mb:py-2">
                      <p className="text-sm text-white/80 whitespace-nowrap overflow-hidden text-ellipsis md:text-sm mb:text-[10px]">{card.category}</p>
                      <p className="mt-2 text-2xl font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis md:text-2xl mb:text-base mb:mt-0.5">
                        {card.title}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
            <AnimatePresence>
              {hoveredIndex !== null && hoverRect && (
                <motion.span
                  key="hover-bg"
                  className="absolute rounded-3xl bg-[#1C303D] dark:bg-slate-800/40 pointer-events-none z-10"
                  initial={{ opacity: 0 }}
                  animate={{
                    top: hoverRect.top,
                    left: hoverRect.left,
                    width: hoverRect.width,
                    height: hoverRect.height,
                    opacity: 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.4 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
        {!showAll && filteredCards.length > 9 && (
          <div className="flex justify-center py-6">
            <button
              onClick={() => setShowAll(true)}
              className="bg-[#1C303D] text-white font-medium px-8 py-3 rounded-full transition"
            >
              View All
            </button>
          </div>
        )}
        {showAll && (
          <div className="flex justify-center py-4">
            <button
              onClick={() => {
                setShowAll(false);
                requestAnimationFrame(() => {
                  const heading = document.getElementById('features-heading');
                  if (heading) {
                    const rect = heading.getBoundingClientRect();
                    const target = (window.pageYOffset || window.scrollY) + rect.top - 120;
                    smoothScrollTo(target, 1000);
                    return;
                  }
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const target = (window.pageYOffset || window.scrollY) + rect.top - 120;
                    smoothScrollTo(target, 1000);
                  }
                });
              }}
              className="h-10 w-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition"
              aria-label="Collapse"
              title="Collapse"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}