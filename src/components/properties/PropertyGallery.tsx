"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X, Eye } from "lucide-react";
import { PropertyImage } from "@/types/property";

interface PropertyGalleryProps {
  images: PropertyImage[];
  propertyName: string;
}

export function PropertyGallery({ images, propertyName }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = images[currentIndex] || images[0];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };

    if (isLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isLightboxOpen, handlePrev, handleNext]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3.5 w-full max-w-full min-w-0">
      {/* Main Large Image Container */}
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-md">
        <Image
          src={activeImage.image_url}
          alt={activeImage.alt_text || `${propertyName} photo ${currentIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Gradient Overlay for Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Fullscreen Expand Action */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 rounded-xl bg-navy-950/75 hover:bg-navy-950 backdrop-blur-md p-2.5 text-white shadow-lg transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-gold-500"
          aria-label="View Fullscreen Lightbox"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Previous / Next Arrow Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-navy-950/60 hover:bg-navy-950/90 backdrop-blur-md p-2.5 text-white shadow-lg transition-all active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-navy-950/60 hover:bg-navy-950/90 backdrop-blur-md p-2.5 text-white shadow-lg transition-all active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Photo Counter Pill */}
        <div className="absolute bottom-4 left-4 rounded-xl bg-navy-950/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white border border-white/10 flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-gold-400" />
          <span>
            {currentIndex + 1} / {images.length} Photos
          </span>
        </div>
      </div>

      {/* Interactive Thumbnail Strip */}
      {images.length > 1 && (
        <div className="w-full max-w-full min-w-0 flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin -mx-1 px-1">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-18 w-24 sm:h-20 sm:w-28 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                currentIndex === idx
                  ? "border-navy-950 ring-2 ring-gold-500 scale-100 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100 hover:scale-95"
              }`}
              aria-label={`Select photo ${idx + 1}`}
            >
              <Image
                src={img.image_url}
                alt={`Thumbnail preview ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen photo viewer"
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Top Bar inside Modal */}
          <div className="w-full flex items-center justify-between text-white max-w-6xl pt-2">
            <div>
              <p className="text-sm font-bold text-white truncate max-w-md">{propertyName}</p>
              <p className="text-xs text-slate-400">
                Photo {currentIndex + 1} of {images.length}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close fullscreen viewer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Photo inside Lightbox */}
          <div className="relative flex-1 w-full max-w-6xl my-4 flex items-center justify-center">
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 z-10 rounded-full bg-white/15 hover:bg-white/30 p-3 text-white transition-all active:scale-90"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 z-10 rounded-full bg-white/15 hover:bg-white/30 p-3 text-white transition-all active:scale-90"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
              </>
            )}

            <div className="relative h-full w-full max-h-[70vh] aspect-[16/10]">
              <Image
                src={activeImage.image_url}
                alt={activeImage.alt_text || propertyName}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          {images.length > 1 && (
            <div className="w-full max-w-2xl flex items-center justify-center gap-2 overflow-x-auto py-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-12 w-16 sm:h-14 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    currentIndex === idx
                      ? "border-gold-400 ring-2 ring-gold-400 scale-105"
                      : "border-transparent opacity-50 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={`Modal thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
