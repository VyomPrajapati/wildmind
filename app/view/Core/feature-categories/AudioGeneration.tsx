import React from "react";
import Link from "next/link"
import { MUSICGENERATION } from "@/routes/routes"
interface FeatureItem {
  title: string
  href: string
  icon: string
  coming?: boolean
}

const audioFeatures: FeatureItem[] = [
  { title: "Text to Music", href: MUSICGENERATION.TEXTTOMUSICNEW, icon: "🎼" },
  // { title: "Audio to Music", href: MUSICGENERATION.TEXTTOMUSICNEW, icon: "🎧" },
  // { title: "Lyrics to Music", href: MUSICGENERATION.TEXTTOMUSICNEW, icon: "📝" },
  { title: "Text to Speech", href: MUSICGENERATION.TEXTTOMUSICNEW, icon: "🖼️" },
  // { title: "Video to Music Suggestion", href: MUSICGENERATION.TEXTTOMUSICNEW, icon: "🎥" },
]

export default function AudioGeneration() {
  return (
    <div className="space-y-4">
      <h3 className="text-regular font-semibold text-white mb-3">
        Audio Generation
      </h3>
            <div className="space-y-3">
        {audioFeatures.map((feature, index) => (
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
