"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import AttachmentsDropdown from "./AttachmentsDropdown"
import { UploadComponent } from "../../UI"
import ImageOverlay from "./ImageOverlay"
import { Download, Bookmark, Heart, Sparkles } from "lucide-react"
import { HoverBorderGradient } from "../../../Core/hover-border-gradient"

interface InputSectionProps {
  prompt: string
  setPrompt: (prompt: string) => void
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
  modelImage: File | null
  setModelImage: (file: File | null) => void
  productImage: File | null
  setProductImage: (file: File | null) => void
}

export default function InputSection({
  prompt,
  setPrompt,
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
  modelImage,
  setModelImage,
  productImage,
  setProductImage,
}: InputSectionProps) {
  const [showUploadComponent, setShowUploadComponent] = useState(false)
  const [uploadType, setUploadType] = useState<'model' | 'product' | null>(null)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())
  const [bookmarkedImages, setBookmarkedImages] = useState<Set<number>>(new Set())
  const [selectedImageForOverlay, setSelectedImageForOverlay] = useState<{
    url: string
    index: number
  } | null>(null)

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleChooseFromLibrary = () => {
    console.log("Choose from library clicked")
  }

  const handleUploadFromDevices = (type: 'model' | 'product') => {
    setUploadType(type)
    setShowUploadComponent(true)
    console.log(`Upload ${type} image clicked`)
  }

  const handleFilesSelected = (files: File[]) => {
    console.log("Files selected:", files)
    if (files.length > 0) {
      if (uploadType === 'model') {
        setModelImage(files[0])
      } else if (uploadType === 'product') {
        setProductImage(files[0])
      }
    }
    // Close the modal when files are selected
    setShowUploadComponent(false)
    setUploadType(null)
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

  // const handleSettingsClick = () => {
  //   onSettingsToggle()
  // }

  return (
    <div className="flex flex-col items-center w-full space-y-6 mb:space-y-4 lg:space-y-12">
      {/* Desktop Layout - Input with buttons inline */}
      <div className="hidden xl:flex items-center gap-4 w-full md:max-w-6xl lg:max-w-7xl px-4">
        <div className="flex-1 relative">
          <div className="flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-full p-4 transition-all duration-300 ease-in-out">
            <AttachmentsDropdown
              onChooseFromLibrary={handleChooseFromLibrary}
              onUploadFromDevices={handleUploadFromDevices}
            />
            {/* Image selection indicators */}
            {(modelImage || productImage) && (
              <div className="absolute -top-1 -right-1 flex gap-1">
                {modelImage && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Model image selected" />
                )}
                {productImage && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" title="Product image selected" />
                )}
              </div>
            )}

            <input
              type="text"
              placeholder="Type a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white outline-none text-lg ml-4"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors border border-white/10">
                <Image src="/newt2image/enhancer.png" alt="enhancer" width={28} height={28} />
              </button>
              <HoverBorderGradient
                onClick={!prompt.trim() || isGenerating ? undefined : onGenerate}
                backgroundColor="bg-[#006aff]"
                className="px-12 py-3 font-medium text-base rounded-full"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </HoverBorderGradient>
            </div>
          </div>
        </div>

        {/* <button
          onClick={handleSettingsClick}
          className="p-3 bg-[#1F1F1F] backdrop-blur-sm rounded-full hover:bg-transparent transition-all duration-300 border border-[#8E8E8E]"
        >
          <Image src="/mockupgeneration/setting.png" alt="Settings" width={32} height={32} className="w-12 h-12" />
        </button> */}
      </div>

      {/* Mobile & Tablet Layout - Fully Responsive */}
      <div className="xl:hidden w-full px-0 ">
        {/* Input Field Only - Full Width Responsive */}
        <div className="w-full  mb-2">
          <div className="flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-full p-2 xs:p-4 transition-all duration-300 ease-in-out">
            <AttachmentsDropdown
              onChooseFromLibrary={handleChooseFromLibrary}
              onUploadFromDevices={handleUploadFromDevices}
            />
            {/* Image selection indicators */}
            {(modelImage || productImage) && (
              <div className="absolute -top-1 -right-1 flex gap-1">
                {modelImage && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Model image selected" />
                )}
                {productImage && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" title="Product image selected" />
                )}
              </div>
            )}

            <input
              type="text"
              placeholder="Type a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white outline-none text-sm xs:text-base sm:text-lg ml-2 mr-1 xs:ml-3"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />

            <button className="p-2 hover:bg-gray-700/50 rounded-full transition-colors border border-white/10 md:ml-2">
              <Image
                src="/newt2image/enhancer.png"
                alt="enhancer"
                width={20}
                height={20}
                className="w-5 h-5 "
              />
            </button>
          </div>
        </div>

        {/* Buttons Below Input - Responsive Sizing */}
        <div className="flex items-center gap-3 xs:gap-4 justify-end w-full">
          <HoverBorderGradient
            onClick={!prompt.trim() || isGenerating ? undefined : onGenerate}
            backgroundColor="bg-[#006aff]"
            className="px-4 py-2.5 xs:py-3 rounded-full font-medium text-sm xs:text-base flex-1 max-w-[100%]"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </HoverBorderGradient>

          {/* <button
            onClick={handleSettingsClick}
            className="p-2 bg-[#1F1F1F] backdrop-blur-sm rounded-full hover:bg-transparent transition-all duration-300 border border-[#8E8E8E] flex-shrink-0"
          >
            <Image
              src="/mockupgeneration/setting.png"
              alt="Settings"
              width={24}
              height={24}
              className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7"
            />
          </button> */}
        </div>
      </div>

      {/* Upload Component Modal */}
      {showUploadComponent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium text-lg">
                Upload {uploadType === 'model' ? 'Model' : 'Product'} Image
              </h3>
              <button
                onClick={() => {
                  setShowUploadComponent(false)
                  setUploadType(null)
                }}
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
