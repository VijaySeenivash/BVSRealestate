"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { uploadPropertyImage, deletePropertyImageFile } from "@/lib/supabase/auth";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export function ImageManager({ images, onChange, disabled = false }: ImageManagerProps) {
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; name: string } | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // File Upload Handler (multi-file with MIME & size validation)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorNotice(null);
    setSuccessNotice(null);

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        setErrorNotice(
          `Invalid file format for "${file.name}". Only JPG, PNG, and WEBP images are supported.`
        );
        e.target.value = "";
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setErrorNotice(
          `"${file.name}" exceeds the maximum allowed size of 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`
        );
        e.target.value = "";
        return;
      }

      validFiles.push(file);
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgress({
          current: i + 1,
          total: validFiles.length,
          name: file.name,
        });

        const publicUrl = await uploadPropertyImage(file);
        uploadedUrls.push(publicUrl);
      }

      onChange([...images, ...uploadedUrls]);
      setSuccessNotice(
        `Successfully uploaded ${validFiles.length} image${validFiles.length > 1 ? "s" : ""} to Supabase Storage!`
      );
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorNotice(
        err.message ||
          "Failed to upload image to Supabase Storage. Verify bucket 'property-images' exists and RLS policies are applied."
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      e.target.value = "";
    }
  };

  // Direct URL Handler
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setErrorNotice(null);
    setSuccessNotice(null);

    try {
      const url = new URL(imageUrlInput.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Protocol must be http: or https:");
      }

      onChange([...images, imageUrlInput.trim()]);
      setImageUrlInput("");
      setSuccessNotice("Image URL added to listing.");
    } catch {
      setErrorNotice("Please enter a valid HTTP/HTTPS URL (e.g. https://example.com/photo.jpg).");
    }
  };

  // Remove Image (and attempt storage cleanup if it's hosted in property-images)
  const handleRemoveImage = async (index: number) => {
    const targetUrl = images[index];
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);

    // Asynchronous cleanup from storage
    deletePropertyImageFile(targetUrl).catch(() => {});
  };

  // Reorder: Set as Cover (Primary)
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([target, ...rest]);
  };

  // Reorder: Move Left
  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Reorder: Move Right
  const handleMoveRight = (index: number) => {
    if (index >= images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-navy-950 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-bvsRed-600" />
            <span>Property Photographs & Media</span>
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {images.length} Image{images.length === 1 ? "" : "s"}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload real photos to Supabase Storage (<code>property-images</code> bucket) or link CDN image URLs. The first image is the public cover card.
        </p>
      </div>

      {/* Error Alert */}
      {errorNotice && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <div className="leading-relaxed font-medium">{errorNotice}</div>
        </div>
      )}

      {/* Success Alert */}
      {successNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{successNotice}</span>
        </div>
      )}

      {/* Upload & Add Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Box */}
        <label
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            disabled || isUploading
              ? "opacity-60 cursor-not-allowed border-slate-200 bg-slate-50"
              : "border-slate-300 hover:border-navy-950 bg-slate-50/50 hover:bg-slate-50"
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            multiple
            disabled={disabled || isUploading}
            onChange={handleFileUpload}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="h-8 w-8 text-navy-950 animate-spin" />
              <div className="text-center">
                <span className="text-xs font-bold text-navy-950 block">
                  Uploading to Supabase Storage...
                </span>
                {uploadProgress && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {uploadProgress.current} of {uploadProgress.total} ({uploadProgress.name})
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-navy-100 text-navy-950 flex items-center justify-center">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-navy-950 block">
                  Click or drag images to upload
                </span>
                <span className="text-[11px] text-slate-500">
                  JPG, PNG, WEBP up to 10MB each
                </span>
              </div>
            </div>
          )}
        </label>

        {/* Add by URL Box */}
        <div className="border border-slate-200 rounded-2xl p-6 flex flex-col justify-center space-y-3 bg-white">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <LinkIcon className="h-3.5 w-3.5" />
            <span>Or Add by Image URL</span>
          </span>
          <div className="flex gap-2">
            <input
              type="url"
              disabled={disabled || isUploading}
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/property.jpg"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950 disabled:opacity-50"
            />
            <button
              type="button"
              disabled={disabled || isUploading || !imageUrlInput.trim()}
              onClick={handleAddImageUrl}
              className="rounded-xl bg-navy-950 hover:bg-navy-900 text-white px-3.5 py-2 text-xs font-bold transition-all disabled:opacity-50"
            >
              Add URL
            </button>
          </div>
          <span className="text-[11px] text-slate-400">
            Useful for stock previews or external image CDNs.
          </span>
        </div>
      </div>

      {/* Previews Gallery with Reordering & Primary Selection */}
      {images.length > 0 ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Listing Photos (Order: Left to Right)
            </span>
            <span className="text-[11px] text-slate-400">
              Use arrow buttons to adjust order
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((imgUrl, index) => {
              const isPrimary = index === 0;

              return (
                <div
                  key={`${imgUrl}-${index}`}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all flex flex-col bg-white ${
                    isPrimary
                      ? "border-gold-500 shadow-md ring-2 ring-gold-500/20"
                      : "border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  {/* Image Canvas */}
                  <div className="relative h-32 w-full bg-slate-100">
                    <Image
                      src={imgUrl}
                      alt={`Photo ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />

                    {/* Primary Badge */}
                    {isPrimary && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-gold-500 text-navy-950 px-2 py-0.5 rounded-md font-black text-[10px] uppercase tracking-wider shadow-sm">
                        <Star className="h-3 w-3 fill-navy-950" />
                        <span>Cover</span>
                      </span>
                    )}

                    {/* Order Index */}
                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Reorder and Delete Controls */}
                  <div className="p-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px] bg-slate-50/50">
                    <div className="flex items-center gap-1">
                      {/* Move Left */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveLeft(index)}
                        className="p-1 rounded text-slate-500 hover:text-navy-950 hover:bg-slate-200 disabled:opacity-20 transition-colors"
                        title="Move image left"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>

                      {/* Move Right */}
                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={() => handleMoveRight(index)}
                        className="p-1 rounded text-slate-500 hover:text-navy-950 hover:bg-slate-200 disabled:opacity-20 transition-colors"
                        title="Move image right"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>

                      {/* Make Cover Button if not primary */}
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(index)}
                          className="px-1.5 py-0.5 rounded font-bold text-slate-700 hover:text-navy-950 hover:bg-slate-200 text-[10px] transition-colors"
                        >
                          Make Cover
                        </button>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 text-xs">
          No photographs added yet. Please upload at least one image to display in the public catalog.
        </div>
      )}
    </div>
  );
}
