import React from "react";

export default function PropertyDetailLoading() {
  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 h-4 w-48 bg-slate-200 rounded-full animate-pulse" />

        {/* Header Card Skeleton */}
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/80 shadow-sm mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-6 w-28 bg-slate-200 rounded-full animate-pulse" />
          </div>
          <div className="h-10 w-80 max-w-full bg-slate-300 rounded-2xl animate-pulse" />
          <div className="h-5 w-48 bg-slate-200 rounded-lg animate-pulse" />
        </div>

        {/* 2-Column Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery + Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="aspect-[16/10] w-full bg-slate-200 rounded-2xl animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 w-28 bg-slate-200 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="h-6 w-40 bg-slate-300 rounded-lg animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-4">
              <div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="h-12 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-12 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
