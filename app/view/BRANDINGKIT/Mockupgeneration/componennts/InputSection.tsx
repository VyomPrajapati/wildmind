"use client"

import Image from "next/image"
import { useState, useRef } from "react"
// import AttachmentsDropdown from "./AttachmentsDropdown"
import { UploadComponent } from "../../UI"
import ImageOverlay from "./ImageOverlay"
import { Download, Bookmark, Heart, Sparkles, X } from "lucide-react"

interface InputSectionProps {
  generatedPrompt: string
  onGenerate: () => void
  onSettingsToggle: () => void
  isGenerating: boolean
  generatedImages: string[]
  selectedFont: string
  selectedStyle: string | null
  selectedQuality: string
  selectedAspectRatio: string
  numberOfImages: number
  logoFile: File | null
  setLogoFile: (file: File | null) => void
  businessName: string
  setBusinessName: (name: string) => void
  businessTagline: string
  setBusinessTagline: (tagline: string) => void
}

export default function InputSection({
  generatedPrompt,
  onGenerate,
  // onSettingsToggle,
  isGenerating,
  generatedImages,
  selectedFont,
  selectedStyle,
  selectedQuality,
  selectedAspectRatio,
  numberOfImages,
  logoFile,
  setLogoFile,
  businessName,
  setBusinessName,
  businessTagline,
  setBusinessTagline,
}: InputSectionProps) {
  const [showUploadComponent, setShowUploadComponent] = useState(false)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())
  const [bookmarkedImages, setBookmarkedImages] = useState<Set<number>>(new Set())
  const [selectedImageForOverlay, setSelectedImageForOverlay] = useState<{
    url: string
    index: number
  } | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // const handleChooseFromLibrary = () => {
  //   console.log("Choose from library clicked")
  // }

  const handleUploadLogo = () => {
    setShowUploadComponent(true)
  }
  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setLogoFile(files[0])
    }
    setShowUploadComponent(false)
  }

  const handleDownload = (imageUrl: string, index: number) => {
    try {
      console.log(`Downloading image ${index + 1}...`)

      const link = document.createElement("a")
      link.href = imageUrl
      link.download = `generated-image-${index + 1}-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.png`
      link.target = "_blank"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(`✅ Image ${index + 1} download initiated successfully`)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download image. Please try again.")
    }
  }

  const handleBookmark = (index: number) => {
    setBookmarkedImages((prev) => {
      const updated = new Set(prev)
      if (updated.has(index)) {
        updated.delete(index)
      } else {
        updated.add(index)
      }
      return updated
    })
  }

  const handleLike = (index: number) => {
    setLikedImages((prev) => {
      const updated = new Set(prev)
      if (updated.has(index)) {
        updated.delete(index)
      } else {
        updated.add(index)
      }
      return updated
    })
  }

  const handleInfo = (imageUrl: string, index: number) => {
    setSelectedImageForOverlay({ url: imageUrl, index })
  }

  const closeImageOverlay = () => {
    setSelectedImageForOverlay(null)
  }

  return (
    <div className="flex flex-col items-center w-full space-y-6 mb:space-y-4 lg:space-y-12">
      {/* Desktop Layout - Input with buttons inline */}
      <div className="hidden xl:flex items-center gap-4 w-full md:max-w-6xl lg:max-w-7xl px-4">
        <div className="flex-1 relative">
          <div className="flex flex-col gap-4 bg-[#ffffff]/5 hover:bg-[#ffffff]/10 backdrop-blur-sm border border-[#8E8E8E] rounded-[4rem] p-8 transition-all duration-300 ease-in-out">
            <div className="flex flex-col gap-4">
              {/* Logo Upload Section */}
              <div className="flex items-center gap-4">
                {!logoFile ? (
                  <button
                    onClick={() => handleUploadLogo()}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#6C3BFF] to-[#412399] text-white rounded-full hover:from-[#5A2FE6] hover:to-[#3A1F8A] transition-all duration-300 border border-[#8E8E8E]/30 hover:border-[#6C3BFF]/50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium">Upload Logo</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-400 font-medium text-sm">
                        {logoFile.name.length > 25 ? logoFile.name.substring(0, 25) + '...' : logoFile.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setLogoFile(null)}
                      className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                      title="Remove logo"
                    >
                      <svg className="w-4 h-4 text-red-400 hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Business Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-white/80 text-sm mb-2 font-medium">Business Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your business name"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full bg-[#ffffff]/10 border border-[#8E8E8E]/50 rounded-full px-4 py-3 text-white placeholder-white/60 outline-none focus:border-[#6C3BFF] transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-white/80 text-sm mb-2 font-medium">Business Tagline (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter your business tagline"
                    value={businessTagline}
                    onChange={e => setBusinessTagline(e.target.value)}
                    className="w-full bg-[#ffffff]/10 border border-[#8E8E8E]/50 rounded-full px-4 py-3 text-white placeholder-white/60 outline-none focus:border-[#6C3BFF] transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onGenerate}
                disabled={isGenerating || !logoFile || !businessName.trim()}
                className="bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors text-white px-12 py-3 rounded-full font-medium text-base"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
        {/* <button
          onClick={onSettingsToggle}
          className="p-3 bg-white/5 backdrop-blur-sm rounded-full hover:bg-transparent transition-all duration-300 border border-[#8E8E8E]"
        >
          <Image src="/mockupgeneration/setting.png" alt="Settings" width={32} height={32} className="w-12 h-12" />
        </button> */}
      </div>
      {/* Mobile & Tablet Layout */}
      <div className="xl:hidden w-full px-0 ">
        <div className="w-full mb-4">
          <div className="flex flex-col gap-3 bg-[#ffffff]/5 hover:bg-[#ffffff]/10 backdrop-blur-sm border border-[#8E8E8E] rounded-xl p-4 xs:p-4 transition-all duration-300 ease-in-out">
            <div className="flex flex-col gap-3">
              {/* Logo Upload Section */}
              <div className="flex items-center gap-2">
                {!logoFile ? (
                  <button
                    onClick={() => handleUploadLogo()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6C3BFF] to-[#412399] text-white rounded-full hover:from-[#5A2FE6] hover:to-[#3A1F8A] transition-all duration-300 text-sm border border-[#8E8E8E]/30 hover:border-[#6C3BFF]/50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium text-sm">Upload Logo</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-400 font-medium text-xs">
                        {logoFile.name.length > 12 ? logoFile.name.substring(0, 12) + '...' : logoFile.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setLogoFile(null)}
                      className="p-0.5 hover:bg-red-500/20 rounded-full transition-colors"
                      title="Remove logo"
                    >
                      <svg className="w-3 h-3 text-red-400 hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Business Information Section */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <label className="text-white/80 text-xs mb-1 font-medium">Business Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your business name"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full bg-[#ffffff]/10 border border-[#8E8E8E]/50 rounded-full px-3 py-2 text-white placeholder-white/60 outline-none focus:border-[#6C3BFF] transition-all duration-300 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-white/80 text-xs mb-1 font-medium">Business Tagline (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter your business tagline"
                    value={businessTagline}
                    onChange={e => setBusinessTagline(e.target.value)}
                    className="w-full bg-[#ffffff]/10 border border-[#8E8E8E]/50 rounded-full px-3 py-2 text-white placeholder-white/60 outline-none focus:border-[#6C3BFF] transition-all duration-300 text-sm"
                  />
                </div>
              </div><button
            onClick={onGenerate}
            disabled={isGenerating || !logoFile || !businessName.trim()}
            className="bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors text-white px-2  py-2.5 xs:py-3 rounded-full font-medium text-sm xs:text-base flex-1 max-w-[32%] "
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 xs:gap-4 justify-end w-full">
          
          {/* <button
            onClick={onSettingsToggle}
            className="p-2 bg-[#1F1F1F] backdrop-blur-sm rounded-full hover:bg-transparent transition-all duration-300 border border-[#8E8E8E] flex-shrink-0"
          >
            <Image src="/mockupgeneration/setting.png" alt="Settings" width={24} height={24} className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
          </button> */}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadComponent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium text-lg">Upload Logo File</h3>
              <button
                onClick={() => setShowUploadComponent(false)}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>
            <UploadComponent onFilesSelected={handleFilesSelected} />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="flex items-center justify-center py-8 xs:py-12 lg:py-16">
          <div className="animate-spin rounded-full h-8 w-8 xs:h-12 xs:w-12 lg:h-16 lg:w-16 border-b-2 border-white"></div>
        </div>
      )}

      {/* Generated Images - Fully Responsive Layout */}
      {generatedImages && generatedImages.length > 0 && (
        <div className="w-full">
          {/* Desktop Layout - Grid */}
          <div className="hidden xl:block max-w-8xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-4 px-6">
              <div className="bg-white/10 rounded-lg p-2">
                <Sparkles className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-white text-sm font-medium">{generatedPrompt}</span>
            </div>

            <div className="relative bg-transparent backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 lg:p-8 min-h-[400px] overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-900/50 rounded-xl overflow-hidden group cursor-pointer"
                    onMouseEnter={() => setHoveredImageIndex(index)}
                    onMouseLeave={() => setHoveredImageIndex(null)}
                  >
                    <div className="w-full aspect-square bg-transparent rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Generated image ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div
                      className={`absolute inset-0 bg-black/10 transition-all duration-300 ${
                        hoveredImageIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <button
                        onClick={() => handleInfo(image, index)}
                        className="text-black font-semibold absolute top-3 right-3 px-[.5vw] bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
                      >
                        !
                      </button>

                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(image, index)}
                          className="p-2 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-lg hover:bg-[#5AD7FF]/30 transition-all duration-200 group/btn"
                        >
                          <Download className="w-4 h-4 text-[#000] group-hover/btn:scale-110 transition-transform" />
                        </button>

                        <button onClick={() => handleBookmark(index)}>
                          <Bookmark
                            className={`w-6 h-6 transition-colors duration-200 ${
                              bookmarkedImages.has(index) ? "fill-[#a4c48c] text-[#a4c48c]" : "text-[#fff]"
                            }`}
                          />
                        </button>

                        <button onClick={() => handleLike(index)}>
                          <Heart
                            className={`w-6 h-6 transition-colors duration-200 ${
                              likedImages.has(index) ? "fill-red-500 text-red-500" : "text-[#fff]"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Layout - Fully Responsive Horizontal Scrolling */}
          <div className="xl:hidden w-full">
            {/* Prompt Display - Responsive Width */}
            <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4 px-3 xs:px-4 sm:px-6">
              <div className="bg-white/10 rounded-lg p-1.5 xs:p-2 flex-shrink-0">
                <Sparkles className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400" />
              </div>
              <span className="text-white text-xs xs:text-sm font-medium line-clamp-2 flex-1">{generatedPrompt}</span>
            </div>

            {/* Horizontal Scrolling Images Container - Fully Responsive */}
            <div className="relative w-full">
              <div
                ref={scrollContainerRef}
                className="flex gap-3 xs:gap-4 overflow-x-auto scrollbar-hide px-3 xs:px-4 sm:px-6 pb-4"
                style={{
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[calc(100vw-6rem)] xs:w-[calc(100vw-8rem)] sm:w-[calc(100vw-12rem)] md:w-[calc(50vw-4rem)] max-w-sm"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {/* Image Container - Responsive */}
                    <div className="relative bg-transparent backdrop-blur-sm border border-gray-700/30 rounded-xl p-3 xs:p-4 overflow-hidden w-full">
                      <div className="relative w-full aspect-square bg-gray-900/50 rounded-xl overflow-hidden">
                        <div className="w-full aspect-square bg-transparent rounded-lg overflow-hidden border border-white/10">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Generated image ${index + 1}`}
                            width={400}
                            height={400}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Mobile Action Buttons - Responsive Sizing */}
                        <div className="absolute inset-0 bg-black/5">
                          {/* Info Button - Top Right */}
                          <button
                            onClick={() => handleInfo(image, index)}
                            className="text-black font-semibold absolute top-2 xs:top-3 right-2 xs:right-3 w-6 h-6 xs:w-8 xs:h-8 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 flex items-center justify-center text-xs xs:text-sm"
                          >
                            !
                          </button>

                          {/* Action Buttons - Bottom Left */}
                          <div className="absolute bottom-2 xs:bottom-3 left-2 xs:left-3 flex items-center gap-1.5 xs:gap-2">
                            <button
                              onClick={() => handleDownload(image, index)}
                              className="p-1.5 xs:p-2 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-lg hover:bg-[#5AD7FF]/30 transition-all duration-200"
                            >
                              <Download className="w-3 h-3 xs:w-4 xs:h-4 text-[#000]" />
                            </button>

                            <button onClick={() => handleBookmark(index)}>
                              <Bookmark
                                className={`w-4 h-4 xs:w-5 xs:h-5 transition-colors duration-200 ${
                                  bookmarkedImages.has(index) ? "fill-[#a4c48c] text-[#a4c48c]" : "text-[#fff]"
                                }`}
                              />
                            </button>

                            <button onClick={() => handleLike(index)}>
                              <Heart
                                className={`w-4 h-4 xs:w-5 xs:h-5 transition-colors duration-200 ${
                                  likedImages.has(index) ? "fill-red-500 text-red-500" : "text-[#fff]"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll Indicators - Responsive */}
              {generatedImages.length > 1 && (
                <div className="flex justify-center mt-3 xs:mt-4 gap-1.5 xs:gap-2">
                  {generatedImages.map((_, index) => (
                    <div key={index} className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-gray-600" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Component Modal */}
      {showUploadComponent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1F1F1F] rounded-2xl p-6 max-w-md w-full border border-[#8E8E8E]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-medium">Upload Logo</h3>
              <button
                onClick={() => setShowUploadComponent(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <UploadComponent
              onFilesSelected={handleFilesSelected}
              title=""
              description="Select a logo file to use for mockup generation"
              supportedFormats="Supports: JPG, PNG, GIF"
              acceptedTypes="image/*"
            />
          </div>
        </div>
      )}

      {/* Image Overlay Modal */}
      {selectedImageForOverlay && (
        <ImageOverlay
          isOpen={!!selectedImageForOverlay}
          onClose={closeImageOverlay}
          imageUrl={selectedImageForOverlay.url}
          prompt={generatedPrompt}
          fontSelect={selectedFont}
          stylePalette={selectedStyle || ""}
          imageQuality={selectedQuality}
          frameSize={selectedAspectRatio}
          numberOfImages={numberOfImages}
        />
      )}

      {/* Add scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar { 
          display: none;
        }
      `}</style>
    </div>
  )
}
