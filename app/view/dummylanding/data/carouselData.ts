export interface CarouselCard {
  src: string;
  title: string;
  description: string;
}

export const carouselCards: CarouselCard[] = [
  {
    src: '/Landingpage/features/text%20to%20image.png',
    title: 'Image Generation',
    description: 'Create stunning visuals from text prompts with state-of-the-art diffusion models.',
  },
  {
    src: '/Landingpage/features/text%20to%20video.png',
    title: 'Video Generation',
    description: 'Generate short videos from ideas, concepts, or scripts with AI.',
  },
  {
    src: '/Landingpage/features/mockup.png',
    title: 'Branding Kit',
    description: 'Logos, mockups, stickers, and assets to power your brand identity.',
  },
  {
    src: '/Landingpage/features/text%20to%20music.png',
    title: 'Audio Generation',
    description: 'Compose music and soundscapes from natural language prompts.',
  },
  {
    src: '/Landingpage/features/film%20generation.png',
    title: 'Filming Tools',
    description: 'Storyboards, shot planning, and VFX tools to accelerate production.',
  },
  {
    src: '/Landingpage/features/text%20to%203d.png',
    title: '3D Generation',
    description: 'Turn ideas into 3D assets and scenes directly from text.',
  },
];
