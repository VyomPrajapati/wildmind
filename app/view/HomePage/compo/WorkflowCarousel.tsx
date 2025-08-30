'use client';

// components/WorkflowCarousel.tsx
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface WorkflowCard {
  id: string;
  title: string;
  subtitle?: string;
  subtitleClassName?: string;
  description: string;
  ctaText?: string;
  image: string; // /public path or remote URL (configure next.config if remote)
}

interface Props {
  items: WorkflowCard[];
  autoPlay?: boolean;
  intervalMs?: number; // autoplay interval
  className?: string;
}



export default function WorkflowCarousel({
  items,
  autoPlay = false,
  intervalMs = 4500,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const deltaX = useRef(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // autoplay
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(t);
  }, [autoPlay, intervalMs, items.length]);

  const go = (i: number) => setIndex(((i % items.length) + items.length) % items.length);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  // drag (mouse/touch) – optional but nice
  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    deltaX.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current) return;
    deltaX.current = e.clientX - startX.current;
    const percent = (-index * 100) + (deltaX.current / trackRef.current.clientWidth) * 100;
    trackRef.current.style.transform = `translate3d(${percent}%,0,0)`;
  };
  const onPointerUp = () => {
    if (!trackRef.current) return;
    setIsDragging(false);
    // snap
    const threshold = 60; // px
    if (deltaX.current > threshold) prev();
    else if (deltaX.current < -threshold) next();
    // reset transform (CSS transition handles snap)
    trackRef.current.style.transform = `translate3d(${-index * 100}%,0,0)`;
  };

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Outer frame */}
      <div className="relative overflow-hidden backdrop-blur-md pb-12 md:pb-16">
        {/* Slider track */}
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translate3d(${-index * 100}%,0,0)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {items.map((item) => (
            <section key={item.id} className="min-w-full pt-4 px-6 md:pl-0 md:pr-12 md:pt-6 md:pb-12 lg:pl-0 lg:pr-12 lg:pt-6 lg:pb-12">
              <article className="relative rounded-3xl ring-white/10 bg-[#1A1A22]/70 px-4 md:pl-8 md:pr-[600px] lg:pr-[680px] py-12 md:py-24 md:min-h-[520px] lg:min-h-[520px] flex flex-col md:flex-row gap-8 items-stretch">
                {/* Left: text */}
                <div className="flex-1 -mt-4 md:-mt-8 lg:-mt-16">
                  <h3 className="text-white text-4xl md:text-[35px] font-medium mb-6 mt-4">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <div className={item.subtitleClassName ?? "text-white/70 text-5xl md:text-6xl"}>
                      {item.subtitle}
                    </div>
                  )}
                  <p className="text-white leading-relaxed mb-4 max-w-[600px] lg:max-w-[800px] md:max-w-[600px] mt-4 text-lg text-justify">
                    {item.description}
                  </p>
                </div>

                {/* Right: image */}
                <div className="relative md:absolute md:right-8 lg:right-8 md:top-0 md:bottom-0 md:w-[600px] lg:w-[700px] h-[220px] md:h-auto">
                  <div className="absolute inset-x-0 top-2 bottom-2 md:top-4 md:bottom-4 lg:top-6 lg:bottom-6 rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/20">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  
                  {/* Button positioned at bottom right of image */}
                  {item.ctaText && (
                    <button className="absolute bottom-10 right-4 inline-flex items-center gap-2 bg-[#1C303D] text-white font-semibold rounded-full px-5 py-2 shadow/50 hover:shadow transition z-10">
                      {item.ctaText}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </article>
            </section>
          ))}
        </div>

        {/* Right-edge mask to hide peeking outline of next card */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-2 md:w-3 bg-[#0b0f17]" />
 
        {/* Arrows */}
        <div className="absolute bottom-18 right-6 md:bottom-14 md:right-16 z-10 flex items-center justify-end gap-6">
          <button
            onClick={prev}
            aria-label="Previous"
            className="w-8 h-8 grid place-items-center rounded-full bg-white text-black"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
 
          <button
            onClick={next}
            aria-label="Next"
            className="w-8 h-8 grid place-items-center rounded-full bg-white text-black"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Dots - mirrored on the left side with similar spacing */}
        <div className="absolute bottom-16 left-3 md:bottom-20 md:left-8 z-10 flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className={`w-1.5 h-1.5 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
