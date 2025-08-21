'use client';

import React, { useEffect } from 'react';
// import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import Button from '../landingPage/components/Button';
import SlideImage from '../landingPage/components/Slideimage';
import { initParticlesEngine } from "@tsparticles/react";


const Header = () => {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);
  

  return (
    <div  className="relative min-h-[80vh] overflow-hidden flex flex-col justify-center items-center 
    mb:h-auto mb:min-h-[80vh] mb:px-2 mb:items-center mb:justify-center mb:flex-col"
     >
         {/* Left side gradient effect */}
      <div className="absolute top-0 left-0 w-1/4 h-2/5 opacity-40 rounded-full blur-3xl" 
           style={{
             background: 'radial-gradient(circle at center, #0a95c3 25%, #5dd0d0 100%)',
             transform: 'translate(-30%, -30%)',
             zIndex: 10
           }}
      />
      {/* Main Content */}
      <div className="z-20 w-full h-full flex flex-col justify-between items-center px-0 md:pt-20 lg:pt-4 mb-28"
      > 
        <SlideImage />

        <Button />
      </div>

      {/* Bottom Gradient Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-transparent to-transparent z-30 mb:bottom-0 mb:w-full mb:h-16 mb:absolute mb:left-0" />

    </div>
  );
};

export default Header;

