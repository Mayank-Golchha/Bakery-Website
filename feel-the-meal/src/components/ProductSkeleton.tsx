/**
 * ProductSkeleton component.
 * Loading placeholder for product cards with shimmer animation.
 */

import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)]">
      {/* Image skeleton */}
      <div className="aspect-[4/3] skeleton" />

      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 skeleton" />
        <div className="h-3 w-full skeleton" />
        <div className="h-3 w-2/3 skeleton" />
        <div className="h-6 w-1/3 skeleton mt-4" />
        <div className="flex gap-2 mt-4">
          <div className="h-10 flex-1 skeleton" />
          <div className="h-10 w-20 skeleton" />
        </div>
      </div>
    </div>
  );
}
