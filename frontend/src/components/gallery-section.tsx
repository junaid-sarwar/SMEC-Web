"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "./ui/dialog"
import { X } from "lucide-react"

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const galleryImages = [
    { src: "/placeholder.svg?height=600&width=800", alt: "SMEC Opening Ceremony" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Coding Competition" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Gaming Tournament" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Robotics Contest" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Award Ceremony" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Team Photo" },
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => setSelectedImage(image.src)}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium">{image.alt}</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
          {selectedImage && (
            <div className="relative w-full aspect-video">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Gallery image"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
