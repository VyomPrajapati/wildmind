"use client"

import { useState } from "react"
import { ChevronDown } from 'lucide-react'

interface SaveFileProps {
  onFileTypeSelect?: (type: string) => void
  selectedFileType?: string | null
}

export default function SaveFile({
  onFileTypeSelect,
  selectedFileType,
}: SaveFileProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState<string | null>(selectedFileType ?? null)

  const options = [
    "GIF",
    "JPG",
    "PNG",
    "SVG"
  ]

  const handleFileTypeSelect = (option: string) => {
    setSelectedOption(option)
    if (onFileTypeSelect) {
      onFileTypeSelect(option)
    }
  }

  return (
<div><div className="mx-2 md:mx-6 border-t border-white/15 mb-2 "></div>
<div className="flex items-center justify-between mb-4 px-2 md:px-6">
        <h3 className="text-white text-lg md:text-xl font-medium">Save File Type</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1"
        >
          <ChevronDown className={`text-white h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      {isOpen && (
        <div className="space-y-2 mb-4 px-2 md:px-6">
          {options.map((option, index) => (
            <button
              key={index}
              className={`w-full p-3 rounded-lg text-left text-white text-sm md:text-sm transition-all duration-200 ${
                selectedOption === option 
                   ? "bg-white/10 border-2 border-[#6C3BFF]"
                  : "bg-white/10 hover:bg-[#3A3A3A] border-2 border-transparent"
              }`}
              onClick={() => handleFileTypeSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 