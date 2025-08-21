"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { HeroParallax } from './components/HeroParallax'
import ScrollFloat from './components/ScrollFloat'
import VariableProximity from './components/VariableProximity'
import { Carousel, Card } from './components/CardsCarousel'
import { LayoutGrid } from './components/LayoutGrid'
import { CardContainer, CardBody, CardItem } from './components/3DCardEffect'
import NAV_LAND from '../landingPage/components/NAV_LAND'
import FeatuesAll from './components/FeatuesAll'
import Subscribe from './components/subscribe'
import SpotlightCard from './components/SpotlightCard'
import FAQ from './components/FAQ'
import { workflowCards } from './data/workflowData'
import { carouselCards } from './data/carouselData'
import { layoutGridCards } from './data/layoutGridData'
import { heroProducts } from './data/heroParallaxData'
import { worldMapDots } from './data/worldMapData'
import FooterNew from './components/FooterNew'
import { HoverBorderGradient } from './components/hover-border-gradiant'
import { WobbleCard } from './components/wobble-card'

// Lazy load heavy components
const LazyCircularGallery = React.lazy(() => import('./components/CicularGallery').then(module => ({ default: module.default })))
const LazyWorldMap = React.lazy(() => import('./components/worldmap').then(module => ({ default: module.WorldMap })))
const Page = () => {
  const router = useRouter()
  const proximityContainerRef = React.useRef<HTMLDivElement | null>(null)
  const hKnowRef = React.useRef<HTMLDivElement | null>(null)
  const hFeaturesRef = React.useRef<HTMLDivElement | null>(null)
  const hHighlightsRef = React.useRef<HTMLDivElement | null>(null)
  const hWorkflowsRef = React.useRef<HTMLDivElement | null>(null)
  const hGlobalRef = React.useRef<HTMLDivElement | null>(null)
  const hWhyRef = React.useRef<HTMLDivElement | null>(null)
  const hPricingRef = React.useRef<HTMLDivElement | null>(null)
  const hArtGalleryRef = React.useRef<HTMLDivElement | null>(null)
  const workflowScrollRef = React.useRef<HTMLDivElement | null>(null)
  const afterScrollFloatRef = React.useRef<HTMLDivElement | null>(null)
  const unlockRef = React.useRef<HTMLDivElement | null>(null)
  const [showProximity, setShowProximity] = React.useState(false)
  const [unlockBelow, setUnlockBelow] = React.useState(false)
  const [canScrollWorkflowLeft, setCanScrollWorkflowLeft] = React.useState(false)
  const [canScrollWorkflowRight, setCanScrollWorkflowRight] = React.useState(true)
  
  // Memoize carousel items to prevent unnecessary re-renders
  const carouselItems = React.useMemo(() => 
    carouselCards.map((card, index) => (
      <Card
        key={card.title}
        card={{
          src: card.src,
          title: card.title,
          description: card.description,
        }}
        index={index}
        layout
      />
    )), [carouselCards]
  )
  
  // Memoized workflow scroll functions to prevent recreation on every render
  const smoothScrollTo = React.useCallback((container: HTMLDivElement, targetLeft: number, duration = 600) => {
    const startLeft = container.scrollLeft;
    const maxLeft = container.scrollWidth - container.clientWidth;
    const clampedTarget = Math.max(0, Math.min(targetLeft, maxLeft));
    const change = clampedTarget - startLeft;
    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollLeft = startLeft + change * easeOutCubic(progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        checkWorkflowScrollability();
      }
    }
    requestAnimationFrame(step);
  }, []);

  const checkWorkflowScrollability = React.useCallback(() => {
    if (workflowScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = workflowScrollRef.current;
      setCanScrollWorkflowLeft(scrollLeft > 0);
      setCanScrollWorkflowRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  const scrollWorkflowLeft = React.useCallback(() => {
    if (workflowScrollRef.current) {
      const container = workflowScrollRef.current;
      const cardWidth = 384; // w-[24rem]
      const gap = 24; // gap-6
      const delta = cardWidth + gap;
      const target = container.scrollLeft - delta;
      smoothScrollTo(container, target, 700);
    }
  }, [smoothScrollTo]);

  const scrollWorkflowRight = React.useCallback(() => {
    if (workflowScrollRef.current) {
      const container = workflowScrollRef.current;
      const cardWidth = 384; // w-[24rem]
      const gap = 24; // gap-6
      const delta = cardWidth + gap;
      const target = container.scrollLeft + delta;
      smoothScrollTo(container, target, 700);
    }
  }, [smoothScrollTo]);

  // Optimized intersection observers with proper cleanup
  React.useEffect(() => {
    const sentinel = afterScrollFloatRef.current
    if (!sentinel) return
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowProximity(true)
        observer.disconnect()
      }
    }, { threshold: 0.5, rootMargin: '50px' })
    
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const el = unlockRef.current
    if (!el) return
    
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setUnlockBelow(true)
        io.disconnect()
      }
    }, { threshold: 0.25, rootMargin: '100px' })
    
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // const [isHovered, setIsHovered] = useState(false)
  return (

    
    <div className='relative w-full h-full bg-[#0a1116]'>                    

    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-6 mb:px-3">
        <NAV_LAND />
    </div>
                
    <div className='w-full bg-[#0a1116]'>
        <HeroParallax products={heroProducts} />
    </div>
    
    {/* Spacer to ensure proper separation (minimized) */}
    <div className="h-0 bg-[#0a1116]"></div>

    {/* New sections after HeroParallax (not nested inside) */}
    <div className={`relative z-[10] bg-[#0a1116] px-8 pt-2 pb-20 flex flex-col items-center text-center mb:px-4 mb:pt-1 ${unlockBelow ? '' : 'min-h-[100vh] overflow-hidden'}`}>
      <ScrollFloat
        containerClassName="text-center"
        animationDuration={5}
        ease="back.inOut(5)"
        textClassName="text-white font-semibold font-poppins text-[clamp(6rem,8vw,6rem)] mb:text-[clamp(2rem,8vw,3rem)]"
        scrollStart="top 85%"
        scrollEnd="bottom 25%"
      >
        Streamline The Entire Visual
      </ScrollFloat>

      <ScrollFloat
        containerClassName="text-center -mt-8"
        textClassName="text-white font-semibold font-poppins text-[clamp(6rem,8vw,6rem)] mb:text-[clamp(2rem,8vw,3rem)]"
        scrollStart="top 85%"
        scrollEnd="bottom 25%"
      >
        Content Production Pipeline
      </ScrollFloat>

      <ScrollFloat
        containerClassName="text-center mt-12"
        textClassName="text-white font-semibold font-poppins text-[clamp(6rem,8vw,6rem)] mb:text-[clamp(2rem,8vw,3rem)]"
        scrollStart="top 85%"
        scrollEnd="bottom 25%"
      >
        From Initial Scripting
      </ScrollFloat>

      <ScrollFloat
        containerClassName="text-center -mt-8"
        textClassName="text-white font-semibold font-poppins text-[clamp(6rem,8vw,6rem)] mb:text-[clamp(2rem,8vw,3rem)]"
        scrollStart="top 85%"
        scrollEnd="bottom 25%"
      >
        To Final Scene Generation
      </ScrollFloat>

      <div ref={afterScrollFloatRef} className="h-[32vh] mb:h-[20vh]" />

      {/* Invisible unlock sentinel placed after both ScrollFloat headings */}
      <div ref={unlockRef} className="h-1" />

      {unlockBelow && showProximity && (
        <div ref={proximityContainerRef} style={{ position: 'relative' }} className="mt-4 mb:mt-6">
            <VariableProximity
              label={'We have got you covered with Image Generation, Video Creation, Audio Production, Branding Requirements, Filming Tools, and 3D Objects!'}
              className={'variable-proximity-demo text-white font-semibold text-[3rem] mb:text-[clamp(1.6rem,6vw,3.5rem)]'}
              fromFontVariationSettings="'wght' 400"
              toFontVariationSettings="'wght' 900"
              containerRef={proximityContainerRef}
              radius={140}
              falloff='linear'
            />
          </div>
      )}
    </div>
    
    {/* Consolidated sections with same background */}
    <div className={`bg-[#0a1116] ${unlockBelow ? '' : 'opacity-0 pointer-events-none'}`}>
      <div className="w-full h-full py-20" ref={hKnowRef}>
        <h2 className="text-white text-center flex justify-center items-center font-bold font-poppins dark:text-neutral-200 text-[3rem] mb-6 mb:text-[2rem] mb:px-4 mb:mb-4">
          <VariableProximity
            label={'Feature Categories'}
            className={''}
            fromFontVariationSettings="'wght' 400"
            toFontVariationSettings="'wght' 900"
            containerRef={hKnowRef}
            radius={140}
            falloff='linear'
          />
        </h2>
        <div className="max-w-7xl mx-auto">
          <Carousel items={carouselItems} />
        </div>
      </div>
      
      <div className="relative z-[10]">
        {/* <ArtGallery /> */}
        {/* <SocialMediaSuite /> */}
        <div ref={hFeaturesRef}>
          <p id="features-heading" className="text-white text-center flex justify-center items-center font-bold font-poppins dark:text-neutral-200 text-[3rem] mb-10 mb:text-[2rem] mb:px-4 mb:mb-4">
            <VariableProximity
              label={'Explore All Our Features'}
              className={''}
              fromFontVariationSettings="'wght' 400"
              toFontVariationSettings="'wght' 900"
              containerRef={hFeaturesRef}
              radius={140}
              falloff='linear'
            />
          </p>
        </div>
        <div>
          <FeatuesAll />
        </div>

        {/* Additional ScrollFloat under Features section - ensure visibility even with short content */}
        <div className="relative z-[10] bg-[#0a1116] px-8 pt-12 flex flex-col items-center min-h-[30vh] text-center mb:px-4 mb:pt-8 mb:min-h-[20vh]">
          <ScrollFloat
            containerClassName="text-center"
            textClassName="text-white font-semibold font-poppins text-[clamp(6rem,8vw,6rem)] mb:text-[clamp(2rem,8vw,3rem)]"
            scrollStart="top 85%"
            scrollEnd="bottom 25%"
          >
            From Imagination To Creation
          </ScrollFloat>
        </div>

        {/* Heading under the second ScrollFloat */}
        <div ref={hHighlightsRef}>
          <p className="text-white text-center flex justify-center items-center font-bold font-poppins dark:text-neutral-200 text-[3rem] mb-6 mb:text-[2rem] mb:px-4 mb:mb-3">
            <VariableProximity
              label={'Check The Latest AI Models Added!'}
              className={''}
              fromFontVariationSettings="'wght' 400"
              toFontVariationSettings="'wght' 900"
              containerRef={hHighlightsRef}
              radius={140}
              falloff='linear'
            />
          </p>
        </div>

        {/* LayoutGrid section */}
        <div className="px-8 mb:px-4 -mt-4">
          <LayoutGrid cards={layoutGridCards} />
        </div>

        {/* Workflows */}
        <div ref={hWorkflowsRef}>
          <p className="text-white text-center flex justify-center items-center font-bold font-poppins dark:text-neutral-200 text-[3rem] mb-6 mt-12 mb:text-[2rem] mb:px-4 mb:mb-4 mb:mt-8">
            <VariableProximity
              label={'Workflows Filtered Based On Your Requirements'}
              className={''}
              fromFontVariationSettings="'wght' 400"
              toFontVariationSettings="'wght' 900"
              containerRef={hWorkflowsRef}
              radius={140}
              falloff='linear'
            />
          </p>
        </div>
        <div className="relative w-full">
          <div className="flex gap-6 overflow-x-auto px-4 py-4 [scrollbar-width:none] mb:gap-4 mb:px-3 mb:py-3" style={{ WebkitOverflowScrolling: 'touch' }} ref={workflowScrollRef} onScroll={checkWorkflowScrollability}>
            {React.useMemo(() => 
              workflowCards.map((item, idx) => (
                <CardContainer key={item.title + idx} className="inter-var" containerClassName="py-6">
                  <CardBody className="bg-[#0f181f] relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[24rem] h-auto rounded-xl p-6 border mb:w-[18rem] mb:p-4">
                    <CardItem translateZ="50" className="text-xl font-bold text-white dark:text-white mb:text-lg">
                      {item.title}
                    </CardItem>
                    <CardItem translateZ="100" rotateX={20} rotateZ={-10} className="w-full mt-4 mb:mt-3">
                      <Image
                        src={item.src}
                        height={1000}
                        width={1000}
                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl mb:h-44"
                        alt="thumbnail"
                      />
                    </CardItem>
                    <div className="flex justify-end items-center mt-16 mb:mt-10">
                      <CardItem translateZ="20" translateX={40} as="button" className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold mb:px-3 mb:text-[10px]">
                        Explore
                      </CardItem>
                    </div>
                  </CardBody>
                </CardContainer>
              )), [workflowCards]
            )}
          </div>
          {/* Workflow Navigation Arrows */}
          <div className="flex justify-end gap-2 mr-10 mb:mr-4">
            <button
              onClick={scrollWorkflowLeft}
              className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50 mb:h-9 mb:w-9"
              disabled={!canScrollWorkflowLeft}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-gray-500 mb:h-5 mb:w-5"
              >
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <button
              onClick={scrollWorkflowRight}
              className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50 mb:h-9 mb:w-9"
              disabled={!canScrollWorkflowRight}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-gray-500 mb:h-5 mb:w-5"
              >
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* WorldMap Section */}
        <div className="w-full max-w-7xl mx-auto px-8 mb:px-4 mt-16 mb:mt-12" ref={hGlobalRef}>
          <h2 className="text-white text-center font-bold font-poppins dark:text-neutral-200 text-[3rem] mb-10 mb:text-[2rem] mb:px-4 mb:mb-4">
            <VariableProximity
              label={'Powering users across the globe, one platform everywhere.'}
              className={''}
              fromFontVariationSettings="'wght' 400"
              toFontVariationSettings="'wght' 900"
              containerRef={hGlobalRef}
              radius={140}
              falloff='linear'
            />
          </h2>
          <React.Suspense fallback={<div className="h-96 bg-gray-800 rounded-lg animate-pulse" />}>
            <LazyWorldMap 
              dots={worldMapDots}
              lineColor="#0ea5e9"
            />
          </React.Suspense>
        </div>

        {/* Why choose wildmindAI Section */}
        <div className="w-full max-w-7xl mx-auto px-8 mb:px-4 mt-32 mb:mt-16" ref={hWhyRef}>
          <h2 className="text-white text-center font-bold font-poppins dark:text-neutral-200 text-[3rem] mb-6 mb:text-[2rem] mb:px-4 mb:mb-4">
            <VariableProximity
              label={'Why Choose Wild Mind?'}
              className={''}
              fromFontVariationSettings="'wght' 400"
              toFontVariationSettings="'wght' 900"
              containerRef={hWhyRef}
              radius={140}
              falloff='linear'
            />
          </h2>
          <p className="text-white text-center font-medium font-poppins text-xl mb:text-lg mb-8 mb:mb-6 opacity-90">
            Powerful. Affordable. Built for creators and teams that expect more from AI.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SpotlightCard className="bg-white/10 border-neutral-800">
              <div className="relative">
                <h3 className="text-neutral-200 font-semibold text-lg mb-3">All-in-One Multimodal AI Platform</h3>
                <p className="text-neutral-400 text-sm leading-relaxed text-justify">Get everything you need: text, image, branding collaterals, video, audio, and more!
                    Over 20+ Generative AI features in one powerful AI workspace.
                    No need to juggle tools or platforms.
                </p>
              </div>
            </SpotlightCard>
            
            <SpotlightCard className="bg-white/10 border-neutral-800">
              <div className="relative">
                <h3 className="text-neutral-200 font-semibold text-lg mb-3">Industry-Leading Value for Price</h3>
                <p className="text-neutral-400 text-sm leading-relaxed text-justify">We offer the most affordable AI platform on the market. No competitor matches the features and performance you get at our price point.</p>
              </div>
            </SpotlightCard>
            
            <SpotlightCard className="bg-white/10 border-neutral-800">
              <div className="relative">
                <h3 className="text-neutral-200 font-semibold text-lg mb-3">Flexible Token System with On-Demand Top-Ups</h3>
                <p className="text-neutral-400 text-sm leading-relaxed text-justify">Run out of credits? Buy exactly what you need, whether it&apos;s 1,000 or 10,000 tokens. No rigid tiers, no waste, just full control.</p>
              </div>
            </SpotlightCard>
            
            <SpotlightCard className="bg-white/10 border-neutral-800">
              <div className="relative">
                <h3 className="text-neutral-200 font-semibold text-lg mb-3">Always Up-to-Date with the Best AI Models</h3>
                <p className="text-neutral-400 text-sm leading-relaxed text-justify">We integrate the world&apos;s most advanced AI models and continuously upgrade to the latest versions, ensuring you always achieve the best possible results.</p>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* WobbleCard Section */}
        <div className="w-full max-w-7xl mx-auto px-8 mb:px-4 mt-32 mb:mt-12" ref={hPricingRef}>
          <h2 className="text-white text-center font-bold font-poppins dark:text-neutral-200 text-[3rem] mb-10 mb:text-[2rem] mb:px-4 mb:mb-4">
            <VariableProximity
              label={'Unmatched Value, Unbeatable Pricing Plans.'}
              className={''}
              fromFontVariationSettings="'wght' 400"
              toFontVariationSettings="'wght' 900"
              containerRef={hPricingRef}
              radius={140}
              falloff='linear'
            />
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb:gap-3 max-w-7xl mx-auto w-full">
            <WobbleCard
              containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px] mb:min-h-[320px] mobile:min-h-[360px]"
              className=""
            >
              <div className="max-w-xs">
                <h2 className="text-left text-balance text-base md:text-xl lg:text-4xl font-semibold tracking-[-0.015em] text-white font-poppins">
                  Free Plan
                </h2>
                <p className="mt-4 text-left font-poppins text-neutral-200 text-justify font-medium">
                Get started with 2,100 free credits and access to our full creative suite. No cost, no commitment, just pure AI power from day one. Generate 100+ Images monthly with the free plan
                </p>
              </div>
              <Image
                src="/Landingpage/ArtGallery/img1.png"
                width={500}
                height={500}
                alt="WildmindAI demo image"
                className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl mb:static mb:mt-6 mb:w-[70%] mb:max-w-[280px] mb:mx-auto mobile:w-[75%]"
              />
            </WobbleCard>
            <WobbleCard containerClassName="col-span-1 min-h-[300px] mb:min-h-[220px]">
              <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-4xl font-semibold tracking-[-0.015em] text-white font-poppins">
                Student Discount
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200 text-justify font-medium">
              Students save 33% on all plans — verified student ID required. Unlock pro-level AI tools at a student-friendly price.
              </p>
            </WobbleCard>
            <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] mb:min-h-[360px] mobile:min-h-[420px]">
              <div className="max-w-sm">
                <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-4xl font-semibold tracking-[-0.015em] text-white font-poppins">
                  Explore All Plans
                </h2>
                <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200 text-justify mr-2 font-medium">
                From hobbyist to enterprise, our plans <br/>scale with your creativity. Get more<br/>credits, more power, more freedom — <br/>see what fits you best
                </p>
              </div>
              <Image
                src="/Landingpage/features/image to image.png"
                width={500}
                height={500}
                alt="WildmindAI demo image"
                className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl mb:static mb:mt-6 mb:w-[80%] mb:max-w-[320px] mb:mx-auto mobile:w-[85%]"
              />
            </WobbleCard>
          </div>
        </div>

        {/* Get Started for Free Button */}
        <div className="mt-32 mb:mt-12 flex justify-center text-center">
          <HoverBorderGradient
            containerClassName="rounded-full border border-[#1C303D] dark:border-white/20"
            as="button"
            duration={1}
            clockwise={false}
            glowBlurPx={0.5}
            innerFillClassName="bg-[#1C303D]"
            className="text-white flex items-center space-x-2 px-8 py-4 mb:px-5 mb:py-3 mb:text-sm rounded-full"
            onClick={() => router.push('/signup')}
          >
            <span>Start Generating</span>
          </HoverBorderGradient>
        </div>

        {/* FAQ */}
        <div className="w-full max-w-7xl mx-auto px-8 mb:px-4 mt-32 mb:mt-12">
          <FAQ />
        </div>

        {/* Circular Gallery (same placement as landingPage) */}
        <div className="w-full max-w-10xl mx-auto px-8 mb:px-4 mt-16 mb:mt-12" ref={hArtGalleryRef}>
          <div className="relative">
            {/* translucent overlay and big label covering both galleries */}
            <div className="pointer-events-none absolute inset-0 z-[35] flex items-center justify-center">
              <div className="absolute inset-0" />
                <span className="relative block text-white font-bold text-9xl md:text-[10rem] lg:text-[10rem] xl:text-[9rem]">
                <VariableProximity
                  label={'Explore Art Gallery'}
                  className={''}
                  fromFontVariationSettings="'wght' 400"
                  toFontVariationSettings="'wght' 900"
                  containerRef={hArtGalleryRef}
                  radius={140}
                  falloff='linear'
                />
              </span>
            </div>

            {/* First gallery */}
            <div className="relative mt-30 z-[30]">
              <div style={{ height: '600px', position: 'relative' }} className="opacity-40">
                <React.Suspense fallback={<div className="h-full bg-gray-800 rounded-lg animate-pulse" />}>
                  <LazyCircularGallery
                    bend={0}
                    textColor="#ffffff"
                    borderRadius={0.05}
                    scrollEase={0.02}
                    imageGap={0.8}
                    items={[
                      { image: '/Landingpage/ArtGallery/img1.png', text: '' },
                      { image: '/Landingpage/ArtGallery/img2.png', text: '' },
                      { image: '/Landingpage/ArtGallery/img3.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex1.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex2.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex3.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex4.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex5.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex6.png', text: '' },
                    ]}
                  />
                </React.Suspense>
              </div>
            </div>
            {/* Second gallery below, opposite direction */}
            <div className="relative -mt-[96px] md:-mt-[140px] lg:-mt-[180px] z-[30]">
              <div style={{ height: '600px', position: 'relative' }} className="opacity-40">
                <React.Suspense fallback={<div className="h-full bg-gray-800 rounded-lg animate-pulse" />}>
                  <LazyCircularGallery
                    bend={0}
                    textColor="#ffffff"
                    borderRadius={0.05}
                    scrollEase={0.02}
                    autoScrollSpeed={-0.05}
                    imageGap={0.8}
                    items={[
                      { image: '/Landingpage/ArtGallery/ex7.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex8.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex9.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex10.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex11.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex12.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex13.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex14.png', text: '' },
                      { image: '/Landingpage/ArtGallery/ex15.png', text: '' },
                    ]}
                  />
                </React.Suspense>
              </div>
          </div>
        </div>
      </div>

        <div className="relative z-[10] -mt-8">
          <Subscribe />
        </div>

        {/* Footer */}
        <div className="relative z-[10] bg-[#0a1116] mt-16">
          <FooterNew />
        </div>
      </div>
    </div>
    </div>
  )
}

export default Page
