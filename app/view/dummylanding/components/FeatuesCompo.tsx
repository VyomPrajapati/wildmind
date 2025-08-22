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
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Ftext%20to%20image.png?alt=media&token=c4d520f4-9634-4337-a12d-f1c7be8c98dc', title: 'Text to Image', category: 'Image Generation', col: 1, row: 3, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fimage%20to%20image.png?alt=media&token=0e50eeb8-768a-4b87-bb0f-38b9e05aad0b', title: 'Image to Image', category: 'Image Generation', col: 1, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fsticker.png?alt=media&token=8486b4d6-5f0e-4ffc-a7bb-f5883c5835dd', title: 'Sticker Generation', category: 'Image Generation', col: 2, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fcharacter%20gen.png?alt=media&token=22643ce1-885a-4625-8655-d608e1fcd228', title: 'Character Generation', category: 'Image Generation', col: 2, row: 3, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fchatracter%20swap.png?alt=media&token=18a0cdb6-09a5-4ed7-a2d4-4d49fcb844fa', title: 'Character Swap', category: 'Image Generation', col: 1, row: 3 },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fin%20paint.png?alt=media&token=97d8fd17-252a-4edf-9945-8dec84615838', title: 'Inpaint', category: 'Image Generation', col: 2, row: 2 },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Flive%20portrtait.png?alt=media&token=d2f96342-4466-4309-bfcc-e55f6e438d82', title: 'Live Portrait', category: 'Image Generation', col: 1, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Ffacial%20expe.png?alt=media&token=9f512ef5-ba55-4d51-aeb5-b66ee2e9728c', title: 'Facial Expression', category: 'Image Generation', col: 2, row: 3, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fimage%20upscale.png?alt=media&token=6f225b2d-5f49-419e-a2f0-493dd27af9ca', title: 'Image Upscale', category: 'Image Generation', col: 1, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fbackground%20remo.png?alt=media&token=da167d22-ca8e-4c90-a990-2fefb1394edb', title: 'Remove Background', category: 'Image Generation', col: 1, row: 2, fit:'cover' },

  // Branding Kit
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Flogo%20generation.png?alt=media&token=b502d6b3-0522-487d-84b2-748bf2e8ced1', title: 'Logo Generation', category: 'Branding Kit', col: 2, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fprouct%20display.png?alt=media&token=af61604f-415a-4fff-bcd5-ccf6dab64d2c', title: 'Product Display', category: 'Branding Kit', col: 2, row: 3, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fmockup.png?alt=media&token=308c6101-51e6-4f23-be23-a3025bd9b545', title: 'Mockup Generation', category: 'Branding Kit', col: 2, row: 3, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2FProduct%20with%20Models.png?alt=media&token=8c34d7fe-5cc1-4df8-be18-01acd0238c9f', title: 'Product with Models', category: 'Branding Kit', col: 2, row: 5, fit:'cover' },

  // Video Generation
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Ftext%20to%20video.png?alt=media&token=c6f16395-285d-4c42-89bd-7dd745fab145', title: 'Text to Video', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fimage%20to%20video.png?alt=media&token=85fbb1f5-eafc-455f-ad2e-c93e278ed356', title: 'Image to Video', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fface%20swap.png?alt=media&token=6c560f62-7921-477f-a579-f500aad3f972', title: 'Face Swap', category: 'Video Generation', col: 1, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fcharcater%20swap.png?alt=media&token=77ad1588-b999-4cd3-8aca-3caf0e74bf48', title: 'Character Swap', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fvfx.png?alt=media&token=d41d05a7-eda1-4ce2-a776-389cace09742', title: 'VFX', category: 'Video Generation', col: 2, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fvideo%20enhancement.png?alt=media&token=bc376eed-5163-44f2-83b7-e853f9d9cea9', title: 'Video Enhancement', category: 'Video Generation', col: 1, row: 2, fit:'cover' },

  // Audio Generation
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Ftext%20to%20music.png?alt=media&token=518a37b2-38ee-4e22-8b98-09e20db0a064', title: 'Text to Music', category: 'Audio Generation', col: 2, row: 4, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Faudio%20to%20music.png?alt=media&token=fa6b39e2-2efb-4c79-b17e-cf828232a92b', title: 'Audio to Music', category: 'Audio Generation', col: 2, row: 3, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Flyrics%20to%20music.png?alt=media&token=c8933ad7-5ee5-4383-8b4b-a8e8c7ca1bca', title: 'Lyrics to Music', category: 'Audio Generation', col: 2, row: 4, fit:'cover' },

  // Filming Tools
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fstoryboard.png?alt=media&token=470a35e1-cb15-4772-b57c-48c5b36746a2', title: 'Storyboard', category: 'Filming Tools', col: 2, row: 2, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Ffilm%20generation.png?alt=media&token=fc605be6-7659-4da1-8221-89ad63f6f47f', title: 'Film Generation', category: 'Filming Tools', col: 2, row: 3, fit:'cover' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Fcomic%20generation.png?alt=media&token=a11dd9e5-c0de-4f13-954c-7367eadb2ea1', title: 'Comic Generation', category: 'Filming Tools', col: 2, row: 2, fit:'cover' },

  // 3D Generation
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Ftextto3d.png?alt=media&token=0d574ba4-b404-4a96-b692-88441f1cdcd9', title: 'Text to 3D', category: '3D Generation', col: 2, row: 2 },
  { src: 'https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Ffeatures%2Ftext%20to%203d.png?alt=media&token=1247f7f9-9d3d-45aa-9626-03e9e69cbf7f', title: 'Image to 3D', category: '3D Generation', col: 2, row: 2, fit:'cover' },
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