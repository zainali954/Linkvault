const SkeletonLinkCard = () => {
  return (
    <div className="relative w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg p-4 animate-pulse overflow-hidden">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-neutral-500 mt-1 shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="h-4 bg-slate-200 dark:bg-neutral-500 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-neutral-600 rounded w-5/6" />
        </div>
      </div>

      {/* URL */}
      <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
        <div className="h-3 bg-slate-200 dark:bg-neutral-500 rounded w-2/3" />
        <div className="w-4 h-4 bg-slate-200 dark:bg-neutral-500 rounded" />
      </div>

      {/* Divider */}
      <hr className="my-4 border-slate-200 dark:border-neutral-600" />

      {/* Category & Tags */}
      <div className="flex items-center flex-wrap gap-2">
        <div className="h-5 w-20 bg-slate-200 dark:bg-neutral-500 rounded" />
        <div className="h-5 w-16 bg-emerald-200 dark:bg-emerald-600/40 rounded" />
        <div className="h-5 w-14 bg-emerald-200 dark:bg-emerald-600/40 rounded" />
      </div>
    </div>
  );
};

export default SkeletonLinkCard;
