"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Filter,
  RefreshCw,
} from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/properties/StatusBadge";
import { getAdminProperties, isUuid } from "@/lib/properties";
import { supabase } from "@/lib/supabase/client";
import { deletePropertyImageFile } from "@/lib/supabase/auth";
import { Property, PropertyStatus } from "@/types/property";
import { formatArea } from "@/lib/utils";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Delete modal state
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await getAdminProperties();
      setProperties(data);
    } catch (err: any) {
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Inline status change handler
  const handleStatusChange = async (property: Property, newStatus: PropertyStatus) => {
    if (property.status === newStatus) return;
    if (!isUuid(property.id)) {
      setActionNotice({
        type: "error",
        message: "Cannot update status: Invalid property UUID identifier.",
      });
      return;
    }
    setUpdatingId(property.id);
    setActionNotice(null);

    try {
      if (supabase) {
        const { error } = await supabase
          .from("properties")
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq("id", property.id);

        if (error) throw error;
      }

      // Update local state
      setProperties((prev) =>
        prev.map((p) => (p.id === property.id ? { ...p, status: newStatus } : p))
      );

      setActionNotice({
        type: "success",
        message: `Status of "${property.title || property.name}" changed to ${newStatus}.`,
      });
    } catch (err: any) {
      console.error("Status update error:", err);
      setActionNotice({
        type: "error",
        message: `Failed to update status: ${err.message || "Unknown error"}`,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete confirmation handler
  const handleConfirmDelete = async () => {
    if (!deletingProperty) return;
    if (!isUuid(deletingProperty.id)) {
      setActionNotice({
        type: "error",
        message: "Cannot delete: Invalid property UUID identifier.",
      });
      setDeletingProperty(null);
      return;
    }
    setIsDeleting(true);
    setActionNotice(null);

    try {
      if (supabase) {
        // Clean up storage files if stored in property-images bucket
        if (deletingProperty.images && deletingProperty.images.length > 0) {
          for (const img of deletingProperty.images) {
            if (img.image_url) {
              await deletePropertyImageFile(img.image_url);
            }
          }
        }

        // Cascade in Postgres deletes related property_images automatically
        const { error } = await supabase
          .from("properties")
          .delete()
          .eq("id", deletingProperty.id);

        if (error) throw error;
      }

      setProperties((prev) => prev.filter((p) => p.id !== deletingProperty.id));
      setActionNotice({
        type: "success",
        message: `Property "${deletingProperty.title || deletingProperty.name}" was successfully deleted.`,
      });
      setDeletingProperty(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      setActionNotice({
        type: "error",
        message: `Failed to delete property: ${err.message || "Unknown error"}`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side filtering
  const filteredProperties = properties.filter((p) => {
    const title = (p.title || p.name || "").toLowerCase();
    const loc = p.location.toLowerCase();
    const type = p.property_type.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      title.includes(searchQuery.toLowerCase().trim()) ||
      loc.includes(searchQuery.toLowerCase().trim()) ||
      type.includes(searchQuery.toLowerCase().trim());

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-bvsRed-600">
                Inventory Database
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-navy-950 mt-1">
                Property Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                View, edit, change statuses, or add new properties to your catalog.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadProperties}
                className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Refresh listings"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>

              <Link
                href="/admin/properties/new"
                className="inline-flex items-center gap-2 rounded-2xl bg-navy-950 hover:bg-navy-900 text-white px-5 py-3 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Plus className="h-4 w-4 text-gold-400" />
                <span>Add Property</span>
              </Link>
            </div>
          </div>

          {/* Action Notice Alert */}
          {actionNotice && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200 ${
                actionNotice.type === "success"
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                  : "bg-red-50 text-red-900 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {actionNotice.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-bvsRed-600" />
                )}
                <span>{actionNotice.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionNotice(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, locality, or type..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-xs font-bold text-slate-700 focus:border-navy-600 focus:outline-none"
              >
                <option value="ALL">All Statuses ({properties.length})</option>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="RESERVED">RESERVED</option>
                <option value="SOLD">SOLD</option>
              </select>
            </div>
          </div>

          {/* Properties Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-navy-900" />
                <p className="text-xs font-bold uppercase tracking-wider">Loading listings...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="p-16 text-center text-slate-500 space-y-3">
                <p className="font-display font-bold text-navy-950 text-base">No properties found</p>
                <p className="text-xs max-w-sm mx-auto">
                  Try adjusting your search keywords or status filter, or click &quot;Add Property&quot; to create a new listing.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-4 px-6">Image</th>
                      <th className="py-4 px-6">Title & Area</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Type</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Status (Quick Switch)</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredProperties.map((property) => {
                      const thumbnail =
                        property.images[0]?.image_url ||
                        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80";

                      const isUpdatingThis = updatingId === property.id;

                      return (
                        <tr
                          key={property.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          {/* Thumbnail */}
                          <td className="py-4 px-6">
                            <div className="relative h-12 w-16 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                              <Image
                                src={thumbnail}
                                alt={property.title || property.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </div>
                          </td>

                          {/* Title & Area */}
                          <td className="py-4 px-6">
                            <div>
                              <span className="font-bold text-navy-950 block text-sm">
                                {property.title || property.name}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {formatArea(property.area, property.area_unit || "sq.ft")}
                              </span>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-4 px-6 text-slate-600 max-w-[160px] truncate">
                            {property.location}
                          </td>

                          {/* Property Type */}
                          <td className="py-4 px-6">
                            <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 uppercase">
                              {property.property_type}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-6 font-display font-black text-navy-950 text-sm">
                            {property.price_display}
                          </td>

                          {/* Status with Inline Changer */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <select
                                value={property.status}
                                disabled={isUpdatingThis}
                                onChange={(e) =>
                                  handleStatusChange(property, e.target.value as PropertyStatus)
                                }
                                className={`rounded-xl px-2.5 py-1 text-xs font-black uppercase tracking-wider border cursor-pointer focus:outline-none transition-all ${
                                  property.status === "AVAILABLE"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    : property.status === "RESERVED"
                                    ? "bg-amber-50 text-amber-900 border-amber-300"
                                    : "bg-slate-200 text-slate-800 border-slate-300"
                                }`}
                              >
                                <option value="AVAILABLE">AVAILABLE</option>
                                <option value="RESERVED">RESERVED</option>
                                <option value="SOLD">SOLD</option>
                              </select>
                              {isUpdatingThis && <Loader2 className="h-3.5 w-3.5 animate-spin text-navy-900" />}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Public View */}
                              <Link
                                href={`/properties/${property.slug}`}
                                target="_blank"
                                className="p-2 rounded-xl text-slate-500 hover:text-navy-950 hover:bg-slate-100 transition-colors"
                                title="Open public listing"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>

                              {/* Edit */}
                              <Link
                                href={`/admin/properties/${property.id}/edit`}
                                className="p-2 rounded-xl text-slate-500 hover:text-navy-950 hover:bg-slate-100 transition-colors"
                                title="Edit property details"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => setDeletingProperty(property)}
                                className="p-2 rounded-xl text-slate-400 hover:text-bvsRed-600 hover:bg-red-50 transition-colors"
                                title="Delete property"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal (Requirement #7) */}
          {deletingProperty && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Confirm property deletion"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
            >
              <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
                <div className="flex items-center gap-3.5 text-bvsRed-600">
                  <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-navy-950">
                      Delete Property?
                    </h3>
                    <p className="text-xs text-slate-500">This action cannot be undone.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-navy-950 text-sm">
                    {deletingProperty.title || deletingProperty.name}
                  </p>
                  <p className="text-slate-500">{deletingProperty.location}</p>
                  <p className="text-[11px] text-red-600 font-semibold pt-1">
                    * All associated property images ({deletingProperty.images.length}) in the database will also be permanently deleted.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeletingProperty(null)}
                    className="w-full py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleConfirmDelete}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-bvsRed-600 hover:bg-bvsRed-700 active:scale-95 text-xs font-bold text-white shadow-md transition-all disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Confirm Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
