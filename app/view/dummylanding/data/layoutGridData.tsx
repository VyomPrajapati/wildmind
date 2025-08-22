import React from 'react'

export interface LayoutGridCard {
  id: number;
  content: React.ReactNode;
  className: string;
  thumbnail: string;
  title: string;
}

export const layoutGridCards: LayoutGridCard[] = [
  {
    id: 1,
    content: (
      <div>
        <p className="font-bold text-white text-4xl mb:text-2xl">Kling 2.0 </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200 mb:text-sm mb:my-3 text-justify">The latest version of the Kling AI video generation model, known for its ability to create 
          high-quality, cinematic videos from text descriptions and images.
</p>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail: "https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Faimodels%2Fkling.png?alt=media&token=0c1fe920-b40e-4ffa-87b2-66f8ab5d920d",
    title: "Kling 2.0",
  },
  {
    id: 2,
    content: (
      <div>
        <p className="font-bold text-white text-4xl mb:text-2xl">Google Veo 3 </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200 mb:text-sm mb:my-3 text-justify">An advanced AI video generation model developed by Google, capable of creating realistic, high-fidelity videos with audio from text prompts or input images.</p>
      </div>
    ),
    className: "col-span-1",
    thumbnail: "https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Faimodels%2Fveo3.png?alt=media&token=39cc736e-f7dc-4aff-8664-9d597288acd3",
    title: "Google Veo 3",
  },
  {
    id: 3,
    content: (
      <div>
        <p className="font-bold text-white text-4xl mb:text-2xl">Flux.1 Krea</p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200 mb:text-sm mb:my-3 text-justify">FLUX.1 Krea [dev] is a new state-of-the-art open-weights model for text-to-image generation that overcomes the oversaturated &apos;AI look&apos; to achieve new levels of photorealism with its distinctive aesthetic approach.</p>
      </div>
    ),
    className: "col-span-1",
    thumbnail: "https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Faimodels%2Fkrea.png?alt=media&token=2210d1da-35c7-46af-9ccf-26e6ac461806",
    title: "Flux.1 Krea",
  },
  {
    id: 4,
    content: (
      <div>
        <p className="font-bold text-white text-4xl mb:text-2xl">Runway Gen 4 Aleph</p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200 mb:text-sm mb:my-3 text-justify">A powerful video model focused on advanced video transformations and editing. It allows users to edit, transform, and generate videos by manipulating existing video clips with text prompts and optional image references.</p>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail: "https://firebasestorage.googleapis.com/v0/b/wild-mind-ai.firebasestorage.app/o/vyom_static_landigpage%2Faimodels%2Frunway.png?alt=media&token=0d14df31-614a-41c8-8d67-2f84b8f693ce",
    title: "Runway Gen 4 Aleph",
  },
];
