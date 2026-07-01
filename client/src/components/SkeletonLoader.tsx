import React from 'react';

interface SkeletonProps {
  count?: number;
}

export const ProductSkeleton: React.FC<SkeletonProps> = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-2xl border border-slate-200/5 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md p-4 animate-pulse gap-3"
        >
          {/* Image box */}
          <div className="aspect-square w-full rounded-xl bg-slate-300 dark:bg-slate-800" />
          
          {/* Tag */}
          <div className="h-3 w-1/4 rounded bg-slate-300 dark:bg-slate-800" />
          
          {/* Title */}
          <div className="h-5 w-3/4 rounded bg-slate-300 dark:bg-slate-800" />
          
          {/* Rating */}
          <div className="h-3.5 w-1/3 rounded bg-slate-300 dark:bg-slate-800" />
          
          {/* Footer price & button */}
          <div className="flex items-center justify-between mt-auto">
            <div className="h-6 w-1/3 rounded bg-slate-300 dark:bg-slate-800" />
            <div className="h-9 w-9 rounded-xl bg-slate-300 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </>
  );
};

export const CategorySkeleton: React.FC<SkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200/5 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md animate-pulse gap-3"
        >
          <div className="h-16 w-16 rounded-full bg-slate-300 dark:bg-slate-800" />
          <div className="h-4 w-20 rounded bg-slate-300 dark:bg-slate-800" />
        </div>
      ))}
    </>
  );
};

export const DetailsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      {/* Gallery Left */}
      <div className="flex flex-col gap-4">
        <div className="aspect-square w-full rounded-2xl bg-slate-300 dark:bg-slate-800" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="aspect-square rounded-xl bg-slate-300 dark:bg-slate-800" />
          ))}
        </div>
      </div>
      {/* Content Right */}
      <div className="flex flex-col gap-4 py-4">
        <div className="h-4 w-1/5 rounded bg-slate-300 dark:bg-slate-800" />
        <div className="h-9 w-3/4 rounded bg-slate-300 dark:bg-slate-800" />
        <div className="h-5 w-1/3 rounded bg-slate-300 dark:bg-slate-800" />
        <div className="h-6 w-1/4 rounded bg-slate-300 dark:bg-slate-800" />
        <div className="h-32 w-full rounded bg-slate-300 dark:bg-slate-800" />
        <div className="h-10 w-1/2 rounded bg-slate-300 dark:bg-slate-800 mt-6" />
      </div>
    </div>
  );
};
