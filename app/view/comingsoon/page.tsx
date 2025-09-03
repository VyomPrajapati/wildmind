'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Check } from 'lucide-react'
import { getImageUrl } from '@/routes/imageroute'
import Prism from './compo/Prism'
import TextPressure from './compo/TextPressure'
import VariableProximity from './compo/VariableProximity'

const ComingSoonPage = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  // Honeypot field (bots often fill every input). Must remain empty.
  const [hp, setHp] = useState<string>('')
  const [cooldownUntil, setCooldownUntil] = useState<number>(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const emailContainerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const isReady = email.trim().length > 0 && hp.length === 0 && Date.now() >= cooldownUntil

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isReady) return

    try {
      setStatus('loading')
      console.log('[Frontend] Making API call to /api/comingsoon/subscribe')
      const res = await fetch('/api/comingsoon/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send honeypot plus a client timestamp for basic telemetry
        body: JSON.stringify({ email, hp, clientTs: Date.now() })
      })
      console.log('[Frontend] API response status:', res.status)
      console.log('[Frontend] API response ok:', res.ok)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.log('[Frontend] API error response:', errorText)
        // Basic cool-down on failure to slow automated retries
        setCooldownUntil(Date.now() + 5000)
        throw new Error('Request failed')
      }
      
      const responseData = await res.json()
      console.log('[Frontend] API success response:', responseData)
      console.log('[Frontend] Webhook status:', responseData.webhookStatus)
      setStatus('success')
      setEmail('') // Clear the email field
      // Add a short cool-down after success to throttle bursts
      const until = Date.now() + 8000
      setCooldownUntil(until)
      setTimeout(() => setStatus('idle'), 5000) // Show success message for 5 seconds
    } catch (error) {
      console.log('[Frontend] API call error:', error)
      setStatus('idle')
    }
  }

  // Memoize Prism props to prevent unnecessary re-renders
  const prismProps = useMemo(() => ({
    height: 3.5,
    baseWidth: 5.5,
    animationType: "hover" as const,
    glow: 1.0,
    scale: 3.5,
    hueShift: 0,
    colorFrequency: 1.5,
    timeScale: 0.5,
    noise: 0,
    bloom: 1,
    customColors: {
      primary: "#3399FF",
      secondary: "#CC33CC",
      tertiary: "#FF6699"
    }
  }), []);

  const socialLinks = [
    {
      title: "X",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: "#",
      hoverColor: "hover:text-blue-500",
      borderHoverColor: "hover:border-blue-500",
      glowColor: "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    },
    {
      title: "Instagram",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      href: "#",
      hoverColor: "hover:text-pink-800",
      borderHoverColor: "hover:border-pink-800",
      glowColor: "hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    },
    {
      title: "Youtube",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      href: "#",
      hoverColor: "hover:text-red-700",
      borderHoverColor: "hover:border-red-700",
      glowColor: "hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]",
    },
    {
      title: "LinkedIn",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      href: "#",
      hoverColor: "hover:text-blue-600",
      borderHoverColor: "hover:border-blue-600",
      glowColor: "hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a1116]">
             {/* Prism Background */}
       <div className="absolute inset-0 z-0">
                   <Prism {...prismProps} />
       </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-3 py-4 md:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center space-x-2 mt-4">
            <Image
              src={getImageUrl("core", "logo") || "/placeholder.svg"}
              alt="WildMind Logo"
              width={40}
              height={32}
              className="h-8 w-auto"
            />
          </div>

          {/* Feature Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => toggleDropdown("features")}
              className="text-white cursor-pointer flex items-center gap-1 font-poppins font-medium bg-transparent border-none outline-none p-0 m-0 mt-2 flex-row-reverse"
            >
              Features
              <ChevronRight 
                className="w-5 h-5 transition-transform duration-200"
                style={{ 
                  transform: activeDropdown === "features" ? 'rotate(-90deg)' : 'rotate(90deg)'
                }}
              />
            </button>

                              {activeDropdown === "features" && (
               <div className="absolute right-0 top-full mt-2 z-50 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-0 text-right">
                     <div className="text-gray-300 hover:text-white cursor-pointer whitespace-nowrap font-poppins text-base py-2 border-b border-gray-600/30">
                       Text to Image
                     </div>
                     <div className="text-gray-300 hover:text-white cursor-pointer whitespace-nowrap font-poppins text-base py-2 border-b border-gray-600/30">
                       Text to Video
                     </div>
                     <div className="text-gray-300 hover:text-white cursor-pointer whitespace-nowrap font-poppins text-base py-2 border-b border-gray-600/30">
                       Sketch to Image
                     </div>
                     <div className="text-gray-300 hover:text-white cursor-pointer whitespace-nowrap font-poppins text-base py-2 border-b border-gray-600/30">
                       Real-time Generation
                     </div>
                     <div className="text-gray-300 hover:text-white cursor-pointer whitespace-nowrap font-poppins text-base py-2 border-b border-gray-600/30">
                       AI Music Generation
                     </div>
                     <div className="text-gray-300 hover:text-white cursor-pointer whitespace-nowrap font-poppins text-base py-2 border-b border-gray-600/30">
                       Branding Kit
                     </div>
                   </div>
                 </div>
               )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
              {/* Coming Soon Text */}
              <div style={{position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0'}}>
              <TextPressure
                text="WILD MIND"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={250}
                className="font-bold"
              />
            </div>

          {/* Subtext */}
          <p className="text-xl md:text-xl font-medium italic text-gray-200 mb-20 max-w-4xl leading-relaxed -mt-36">
            &ldquo;Redefining and Unifying AI Powered Creative Tools for Everyone <br />
            One Platform for Limitless Imagination and Effortless Execution&rdquo;
          </p>

          {/* Email Subscription */}
          {/* Heading Text */}
          <div className="w-full max-w-full mx-auto mb-4 mt-4" ref={emailContainerRef}>
            <div className="text-xl md:text-lg font-bold text-gray-200 text-center">
              <div style={{ marginBottom: '10px' }}>
                <VariableProximity
                  label="Wild Mind is Launching Shortly! Be Amongst the First to Experience our AI Powered Creative Hub."
                  fromFontVariationSettings="'wght' 400, 'wdth' 100"
                  toFontVariationSettings="'wght' 900, 'wdth' 200"
                  containerRef={emailContainerRef}
                  radius={100}
                  falloff="exponential"
                  className="font-bold text-gray-200 block"
                  style={{ fontSize: '25px' }}
                />
              </div>
              <VariableProximity
                label="Sign Up with your Email to recieve exclusive updates and early access."
                fromFontVariationSettings="'wght' 400, 'wdth' 100"
                toFontVariationSettings="'wght' 900, 'wdth' 200"
                containerRef={emailContainerRef}
                radius={100}
                falloff="exponential"
                className="font-bold text-gray-200 block"
                style={{ fontSize: '25px' }}
              />
            </div>
          </div>

          {/* Email Subscription Form */}
          <div className="w-[500px] max-w-2xl mx-auto mt-10">
            {/* Success Message */}
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Thank you! Your email has been successfully submitted. We&apos;ll keep you updated!</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 w-full">
                  <input
                   type="email"
                   placeholder="Email address"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   className="flex-1 bg-transparent border-2 border-white/30 text-white rounded-full px-6 py-2 placeholder-gray-300 placeholder:text-base focus:outline-none focus:ring-0  focus:shadow-none transition-all duration-300"
                 />
                 {/* Honeypot field (hidden from users) */}
                 <input
                   type="text"
                   tabIndex={-1}
                   autoComplete="off"
                   value={hp}
                   onChange={(e) => setHp(e.target.value)}
                   className="hidden"
                   aria-hidden="true"
                 />
                <button
                  type="submit"
                  disabled={!isReady || status === 'loading'}
                  aria-label="Submit email"
                  className={`bg-white text-black px-8 py-2 rounded-full font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 whitespace-nowrap
                    ${status === 'loading' ? 'cursor-wait' : 'cursor-pointer'}
                    ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : status === 'success' ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Submitted!
                    </span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* Footer with Social Icons */}
        <footer className="px-6 py-4 md:px-8 lg:px-12">
          <div className="flex justify-end">
            <div className="flex -space-x-1">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ComingSoonPage
