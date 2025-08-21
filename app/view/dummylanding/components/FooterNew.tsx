'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/routes/imageroute'
import { NAV_ROUTES, FEATURE_ROUTES } from '@/routes/routes'
import {
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandX,
} from '@tabler/icons-react'
import Squares from './Squares'

const FooterNew: React.FC = () => {
  const legalLinks = [
    { name: "Terms of use", href: "" },
    { name: "Privacy Policy", href: "" },
    { name: "Cookies", href: "" },
    { name: "Legal Notice", href: "" },
    { name: "DMCA", href: "" },
  ];

  const socialLinks = [
    {
      title: "X",
      icon: IconBrandX,
      href: "#",
      hoverColor: "hover:text-blue-500",
      borderHoverColor: "hover:border-blue-500",
      glowColor: "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    },
    {
      title: "Instagram",
      icon: IconBrandInstagram,
      href: "#",
      hoverColor: "hover:text-pink-800",
      borderHoverColor: "hover:border-pink-800",
      glowColor: "hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    },
    {
      title: "Youtube",
      icon: IconBrandYoutube,
      href: "#",
      hoverColor: "hover:text-red-700",
      borderHoverColor: "hover:border-red-700",
      glowColor: "hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]",
    },
  ];

  return (
    <footer className="relative z-[10] bg-[#0a1116] w-full">
      <div className="max-w-8xl mx-auto px-6 sm:px-10 mb:px-4">
        <div className="relative z-0 pb-2 max-w-7xl mx-auto text-white p-6 sm:p-10 mb:p-5 rounded-t-3xl border border-b-0 border-white/20 overflow-hidden ">
           {/* Background decorative grid */}
           <div className="absolute inset-0 opacity-10">
             <Squares 
               speed={0.5}
               squareSize={40}
               direction='down'
               borderColor='#ffffff'
               hoverFillColor='#222222'
             />
           </div>
           <div className="relative z-10">
            {/* Main Footer Content */}
            <div className="py-12 border-b border-white/10 mb:py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb:gap-6">
                {/* Logo and Brand */}
                <div className="lg:col-span-1">
                  <div className="mb-4">
                    <Image
                      src={getImageUrl("core", "logo") || "/placeholder.svg"}
                      alt="WildMind Logo"
                      width={120}
                      height={48}
                      className="h-8 w-auto mb:h-7"
                    />
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                    WildMind uses advanced AI to turn imagination into high-quality, creative visuals.
                  </p>
                  
                  {/* Social Media Icons */}
                  <div className="flex gap-4 mt-6 mb:gap-3">
                    {socialLinks.map((social, index) => (
                      <Link
                        key={index}
                        href={social.href}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#545454] bg-[#1E1E1E] 
                        ${social.hoverColor} ${social.borderHoverColor} ${social.glowColor} transition-all duration-200`}
                      >
                        <social.icon className="w-5 h-5 mb:w-4 mb:h-4" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Home Category */}
                <div className="space-y-4 ml-32 mb:ml-0">
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                    Home
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href={NAV_ROUTES.PRICING} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        Plans
                      </Link>
                    </li>
                    <li>
                      <Link href="" className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link href={NAV_ROUTES.TEMPLATES} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        Templets
                      </Link>
                    </li>
                    <li>
                      <Link href={NAV_ROUTES.ART_STATION} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        Art station
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Features Category */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                    Features
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href={FEATURE_ROUTES.IMAGE_GENERATION} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        Text to Image
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        Text to Video (soon)
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        Sketch to Image (soon)
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        Real Time Generation (soon)
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Company Category */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                    Company
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href={NAV_ROUTES.BLOG} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href={NAV_ROUTES.CONTACT} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        ContactUs
                      </Link>
                    </li>
                    <li>
                      <Link href={NAV_ROUTES.SUPPORT} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link href="" className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                        About us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm mb:text-xs text-center">
                Copyright © 2025 WildMind Pvt Ltd. All rights reserved.
              </div>
              
              {/* Legal Links */}
              <div className="flex flex-wrap gap-6 justify-center mb:gap-4">
                {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-200 mb:text-xs"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterNew
