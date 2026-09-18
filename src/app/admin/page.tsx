import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Building2,
  CheckCircle,
  Clock,
  CheckSquare,
  ArrowRight,
  ExternalLink,
  MapPin,
  Maximize2,
  TrendingUp,
} from "lucide-react";
import { getAdminProperties, getDashboardStats } from "@/lib/properties";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "@/components/properties/StatusBadge";
import { formatArea } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const allProperties = await getAdminProperties();
  const recentProperties = allProperties.slice(0, 5);

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-bvsRed-600">
                Administration Overview
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-navy-950 mt-1">
                Property Portfolio Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time inventory metrics synchronized with your Supabase database.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/properties/new"
                className="inline-flex items-center gap-2 rounded-2xl bg-navy-950 hover:bg-navy-900 text-white px-5 py-3 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Plus className="h-4 w-4 text-gold-400" />
                <span>Add Property</span>
              </Link>
            </div>
          </div>

          {/* 4 Dynamic Statistic Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Properties
                </span>
                <div className="h-9 w-9 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              <p className="font-display text-3xl sm:text-4xl font-black text-navy-950">
                {stats.total_properties}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Registered in Supabase
              </p>
            </div>

            {/* Available */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Available
                </span>
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
              <p className="font-display text-3xl sm:text-4xl font-black text-emerald-700">
                {stats.available}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Open for booking enquiries
              </p>
            </div>

            {/* Reserved */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Reserved
                </span>
                <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="font-display text-3xl sm:text-4xl font-black text-amber-700">
                {stats.reserved}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Under token negotiation
              </p>
            </div>

            {/* Sold */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Sold
                </span>
                <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <CheckSquare className="h-4 w-4" />
                </div>
              </div>
              <p className="font-display text-3xl sm:text-4xl font-black text-slate-700">
                {stats.sold}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Closed & registered
              </p>
            </div>
          </div>

          {/* Quick Actions & Recent Listings Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Recent Properties (Left 8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy-950">
                    Recent Listings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Recently added properties in Dindigul
                  </p>
                </div>

                <Link
                  href="/admin/properties"
                  className="inline-flex items-center gap-1 text-xs font-bold text-navy-950 hover:text-navy-700"
                >
                  <span>Manage All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {recentProperties.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 space-y-3">
                    <Building2 className="h-8 w-8 mx-auto text-slate-300" />
                    <p className="font-bold text-navy-950 text-sm">No properties in database yet</p>
                    <p className="text-xs text-slate-400">Click &quot;Add Property&quot; to publish your first live listing.</p>
                  </div>
                ) : (
                  recentProperties.map((property) => {
                    const thumbnail =
                      property.images[0]?.image_url ||
                      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80";

                  return (
                    <div
                      key={property.id}
                      className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/75 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                          <Image
                            src={thumbnail}
                            alt={property.title || property.name}
                            fill
                            sizes="100px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-navy-950 truncate">
                            {property.title || property.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="truncate">{property.location.split(",")[0]}</span>
                            <span>•</span>
                            <span>{formatArea(property.area, property.area_unit || "sq.ft")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-display font-black text-sm text-navy-950 hidden sm:inline">
                          {property.price_display}
                        </span>
                        <StatusBadge status={property.status} size="sm" />
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-navy-950 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  );
                }))}
              </div>
            </div>

            {/* Quick Actions & Short Navigation (Right 4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="font-display text-base font-bold text-navy-950">
                  Quick Actions
                </h3>
                <div className="space-y-2.5">
                  <Link
                    href="/admin/properties/new"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-50 hover:bg-navy-100 border border-navy-100 text-navy-950 text-xs font-bold transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Plus className="h-4 w-4 text-bvsRed-600" />
                      <span>Add New Property</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-navy-700" />
                  </Link>

                  <Link
                    href="/admin/properties"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="h-4 w-4 text-navy-700" />
                      <span>Manage All Properties</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/properties"
                    target="_blank"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <ExternalLink className="h-4 w-4 text-emerald-600" />
                      <span>Preview Live Website</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* Status Reference Card */}
              <div className="bg-navy-950 text-white rounded-3xl p-6 border border-navy-900 shadow-md space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-400">
                  Status Workflow
                </span>
                <h4 className="font-display font-bold text-sm text-white">
                  Dynamic Synchronization
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When you update property details or change a property status to <strong>AVAILABLE</strong>, <strong>RESERVED</strong>, or <strong>SOLD</strong>, the public website automatically updates immediately via Supabase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
