import React from "react";

export default function PropertiesLoading() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-4 w-36 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-10 w-72 bg-slate-300 rounded-2xl animate-pulse" />
          <div className="h-5 w-96 max-w-full bg-slate-200 rounded-xl animate-pulse" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm mb-8 space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-7 w-20 bg-slate-200 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-12 w-full bg-slate-100 rounded-2xl animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm flex flex-col"
            >
              {/* Image Skeleton */}
              <div className="aspect-[16/10] w-full bg-slate-200 animate-pulse relative">
                <div className="absolute top-3 left-3 h-6 w-20 bg-slate-300 rounded-full" />
              </div>
              {/* Content Skeleton */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-24 bg-slate-300 rounded-lg animate-pulse" />
                    <div className="h-5 w-16 bg-slate-200 rounded-md animate-pulse" />
                  </div>
                  <div className="h-5 w-48 bg-slate-300 rounded-lg animate-pulse" />
                  <div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <div className="h-9 bg-slate-200 rounded-xl animate-pulse" />
                  <div className="h-9 bg-slate-200 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
