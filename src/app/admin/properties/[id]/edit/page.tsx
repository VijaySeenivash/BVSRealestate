"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageManager } from "@/components/admin/ImageManager";
import { supabase } from "@/lib/supabase/client";
import { getPropertyById, isUuid } from "@/lib/properties";
import { PropertyStatus } from "@/config/site";

const PROPERTY_TYPES = [
  "RESIDENTIAL PLOT",
  "LAND",
  "HOUSE",
  "COMMERCIAL PROPERTY",
  "AGRICULTURAL LAND",
  "VILLA",
  "APARTMENT",
];

const AREA_UNITS = ["sq.ft", "cents", "acres"];
const PRICE_UNITS = ["Lakhs", "Crores", "Thousand"];

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;

  // Loading state
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState<string>("RESIDENTIAL PLOT");
  const [area, setArea] = useState<string>("");
  const [areaUnit, setAreaUnit] = useState<string>("sq.ft");
  const [price, setPrice] = useState<string>("");
  const [priceUnit, setPriceUnit] = useState<string>("Lakhs");
  const [status, setStatus] = useState<PropertyStatus>("AVAILABLE");
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");

  // Images state managed by ImageManager
  const [images, setImages] = useState<string[]>([]);

  // Form submission state
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Load existing property data
  useEffect(() => {
    async function loadData() {
      if (!propertyId || !isUuid(propertyId)) {
        setNotFound(true);
        setLoadingInitial(false);
        return;
      }
      setLoadingInitial(true);
      try {
        const prop = await getPropertyById(propertyId);
        if (!prop) {
          setNotFound(true);
          return;
        }

        setTitle(prop.title || prop.name || "");
        setSlug(prop.slug || "");
        setLocation(prop.location || "");
        setPropertyType(prop.property_type || "RESIDENTIAL PLOT");
        setArea(String(prop.area || ""));
        setAreaUnit(prop.area_unit || "sq.ft");
        setPrice(String(prop.price || ""));
        setPriceUnit(prop.price_unit || "Lakhs");
        setStatus(prop.status || "AVAILABLE");
        setDescription(prop.description || "");
        setHighlights(Array.isArray(prop.highlights) ? prop.highlights : []);
        setMapsUrl(prop.maps_url || prop.google_maps_url || "");
        setImages(prop.images ? prop.images.map((img) => img.image_url) : []);
      } catch (err) {
        console.error("Error loading property:", err);
        setNotFound(true);
      } finally {
        setLoadingInitial(false);
      }
    }

    loadData();
  }, [propertyId]);

  // Highlights management
  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight("");
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // Save changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const cleanTitle = title.trim();
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const cleanLocation = location.trim();
    const numArea = Number(area);
    const numPrice = Number(price);

    if (!propertyId || !isUuid(propertyId)) {
      setFormError("Cannot save changes: Invalid property UUID identifier.");
      return;
    }

    if (!cleanTitle) {
      setFormError("Please enter a property title.");
      return;
    }
    if (!cleanSlug) {
      setFormError("Please enter a valid unique slug.");
      return;
    }
    if (!cleanLocation) {
      setFormError("Please enter the location.");
      return;
    }
    if (!area || isNaN(numArea) || numArea <= 0) {
      setFormError("Please enter a valid positive area number.");
      return;
    }
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setFormError("Please enter a valid positive price number.");
      return;
    }
    if (!PROPERTY_TYPES.includes(propertyType)) {
      setFormError("Please select a valid property type.");
      return;
    }
    if (!["AVAILABLE", "RESERVED", "SOLD"].includes(status)) {
      setFormError("Please select a valid property status.");
      return;
    }
    if (images.length === 0) {
      setFormError("Property must have at least one photograph.");
      return;
    }

    setSaving(true);

    try {
      if (!supabase) {
        throw new Error("Supabase is not configured in .env.local.");
      }

      // Check slug uniqueness across other listings
      const { data: existingSlug, error: slugError } = await supabase
        .from("properties")
        .select("id")
        .eq("slug", cleanSlug)
        .neq("id", propertyId)
        .maybeSingle();

      if (slugError) {
        console.warn("[Slug Check Warning]:", slugError.message);
      } else if (existingSlug) {
        setFormError(
          `Another property listing is already using the slug "${cleanSlug}". Please customize the slug.`
        );
        setSaving(false);
        return;
      }

      // 1. Update public.properties row
      const { error: updateError } = await supabase
        .from("properties")
        .update({
          title: cleanTitle,
          slug: cleanSlug,
          location: cleanLocation,
          area: numArea,
          area_unit: areaUnit,
          price: numPrice,
          price_unit: priceUnit,
          property_type: propertyType,
          status,
          description: description.trim(),
          highlights: highlights.filter((h) => h.trim().length > 0),
          maps_url: mapsUrl.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", propertyId);

      if (updateError) throw updateError;

      // 2. Sync property_images table
      await supabase.from("property_images").delete().eq("property_id", propertyId);

      // Re-insert current images with clean display_order
      if (images.length > 0) {
        const imageRows = images.map((url, idx) => ({
          property_id: propertyId,
          image_url: url,
          display_order: idx,
        }));
        await supabase.from("property_images").insert(imageRows);
      }

      setFormSuccess("Property changes saved successfully! Redirecting...");
      setTimeout(() => {
        router.push("/admin/properties");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      console.error("Save error:", err);
      setFormError(err.message || "Failed to update property. Check admin permissions.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-navy-950" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Loading property record from Supabase...
            </p>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  if (notFound) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="max-w-2xl mx-auto py-12 text-center space-y-4 bg-white rounded-3xl p-8 border border-slate-200">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-black text-navy-950">Property Not Found</h2>
            <p className="text-xs text-slate-500">
              The property with ID <code className="bg-slate-100 px-1 py-0.5 rounded">{propertyId}</code> could not be found.
            </p>
            <Link
              href="/admin/properties"
              className="inline-flex items-center gap-2 rounded-2xl bg-navy-950 text-white px-5 py-3 text-xs font-bold"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Properties List</span>
            </Link>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Link
                href="/admin/properties"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy-950 transition-colors mb-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to All Properties</span>
              </Link>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-navy-950">
                Edit Property Listing
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Editing: <span className="font-semibold text-navy-950">{title}</span> (ID: {propertyId})
              </p>
            </div>

            {slug && (
              <Link
                href={`/properties/${slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <span>View Live Listing</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {/* Feedback Alerts */}
          {formError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Unable to save updates</p>
                <p className="text-xs mt-0.5">{formError}</p>
              </div>
            </div>
          )}

          {formSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <p className="font-bold text-sm">{formSuccess}</p>
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-navy-950">
                  1. Basic Property Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update the title, slug, and core categorization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950 transition-all"
                    required
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-mono text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950 transition-all"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    Live URL: /properties/{slug}
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Location / Locality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950 transition-all"
                    required
                  />
                </div>

                {/* Property Type */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950 transition-all bg-white"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Inventory Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950 transition-all bg-white"
                  >
                    <option value="AVAILABLE">AVAILABLE (Open for Inquiries)</option>
                    <option value="RESERVED">RESERVED (Under Booking)</option>
                    <option value="SOLD">SOLD (Closed Deal)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Area */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-navy-950">
                  2. Pricing & Dimension Specifications
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update land measurements and pricing values.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Area & Unit */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950 transition-all"
                      required
                    />
                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value)}
                      className="w-32 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-navy-950 bg-slate-50 focus:border-navy-950"
                    >
                      {AREA_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Unit */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Listing Price <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950 transition-all"
                      required
                    />
                    <select
                      value={priceUnit}
                      onChange={(e) => setPriceUnit(e.target.value)}
                      className="w-32 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-navy-950 bg-slate-50 focus:border-navy-950"
                    >
                      {PRICE_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Description, Highlights & Maps */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-navy-950">
                  3. Description & Selling Highlights
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-4 text-sm font-medium text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950 transition-all"
                  required
                />
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Key Highlights / Features
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {highlights.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-navy-50 border border-navy-200/60 px-3 py-1.5 text-xs font-semibold text-navy-900"
                    >
                      <Sparkles className="h-3 w-3 text-gold-500" />
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="p-0.5 hover:text-red-600 rounded-md transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    placeholder="Add key feature..."
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 text-xs transition-colors"
                  >
                    Add Highlight
                  </button>
                </div>
              </div>

              {/* Google Maps URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Google Maps Location Link (Optional)
                </label>
                <input
                  type="url"
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-navy-950 focus:border-navy-950 focus:ring-1 focus:ring-navy-950 transition-all"
                />
              </div>
            </div>

            {/* Section 4: Polished Image Management with ImageManager */}
            <ImageManager
              images={images}
              onChange={setImages}
              disabled={saving}
            />

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
              <Link
                href="/admin/properties"
                className="w-full sm:w-auto text-center px-6 py-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-navy-950 hover:bg-navy-900 active:scale-95 text-white font-bold text-xs shadow-lg transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-gold-400" />
                    <span>Saving Changes to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-gold-400" />
                    <span>Save Property Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
