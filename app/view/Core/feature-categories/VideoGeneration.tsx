import React from "react";
import Link from "next/link"
import { VIDEOGENERATION } from "@/routes/routes"
interface FeatureItem {
  title: string
  href: string
  icon: string
  coming?: boolean
}

const videoFeatures: FeatureItem[] = [
  { title: "Text to Video",  href: VIDEOGENERATION.VIDEO_GENERATION, icon: "🎬" },
  { title: "Image to Video", href: VIDEOGENERATION.VIDEO_GENERATION, icon: "🎞️" },
  // { title: "VFX AI", href: VIDEOGENERATION.VIDEO_GENERATION, icon: "✨" },
  // { title: "Face Swap", href: VIDEOGENERATION.VIDEO_GENERATION, icon: "🔄" },
  // { title: "Character Swap", href: VIDEOGENERATION.VIDEO_GENERATION, icon: "👥" },
  // { title: "Video Enhancement", href: VIDEOGENERATION.VIDEO_GENERATION, icon: "⚡" },
]

export default function VideoGeneration() {
  return (
    <div className="space-y-4">
      <h3 className="text-regular font-semibold text-white mb-3 md:text-sm">
        Video Generation
      </h3>
            <div className="space-y-3">
        {videoFeatures.map((feature, index) => (
           <Link
           key={index}
           href={feature.href}
           className="flex items-center text-white hover:text-white transition-all duration-200 text-sm group"
         >
                     <span>{feature.title}</span>
           {feature.coming && <span className="text-xs text-yellow-400 ml-2">(Soon)</span>}
         </Link>
        ))}
      </div>
    </div>
  )
}
