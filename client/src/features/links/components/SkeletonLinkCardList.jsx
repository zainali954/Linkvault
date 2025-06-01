import React from "react";

const SkeletonLinkCardList = () => {
  return (
    <div className="w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg p-3 animate-pulse flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden">
      
      {/* Left: Favicon + title/description */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-neutral-500 mt-1 shrink-0" />
        <div className="flex flex-col gap-2 min-w-0 w-full">
          <div className="h-4 bg-slate-200 dark:bg-neutral-500 rounded w-2/3" />
          <div className="h-3 bg-slate-200 dark:bg-neutral-600 rounded w-4/5" />
        </div>
      </div>

      {/* Center: URL + copy */}
      <div className="flex items-center gap-2 md:justify-center flex-1 min-w-0">
        <div className="h-3 bg-slate-200 dark:bg-neutral-500 rounded w-2/3" />
        <div className="w-4 h-4 bg-slate-200 dark:bg-neutral-500 rounded" />
      </div>

      {/* Right: actions + tags */}
      <div className="flex flex-col items-start md:items-end gap-2 flex-none w-full md:w-auto">
        <div className="flex gap-2">
          <div className="w-5 h-5 bg-slate-200 dark:bg-neutral-500 rounded" />
          <div className="w-5 h-5 bg-slate-200 dark:bg-neutral-500 rounded" />
          <div className="w-5 h-5 bg-slate-200 dark:bg-neutral-500 rounded" />
        </div>
        <div className="flex flex-wrap gap-1 justify-start md:justify-end max-w-full">
          <div className="h-5 w-20 bg-slate-200 dark:bg-neutral-500 rounded" />
          <div className="h-5 w-16 bg-emerald-200 dark:bg-emerald-600/40 rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLinkCardList;
