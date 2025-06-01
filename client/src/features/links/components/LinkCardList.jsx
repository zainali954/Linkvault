import React, { useState, useEffect } from "react";
import { Copy01Icon, Delete01Icon, Edit02Icon, StarIcon, StarOffIcon } from "hugeicons-react";
import useDeleteLink from "../../../hooks/useDeleteLink";
import useFavoriteLink from "../../../hooks/useFavoriteLink";

const LinkCardList = ({ _id, favicon, url, title, description, category, tags = [], onEdit, isFavorite }) => {
  const [copied, setCopied] = useState(false);
  const { mutate: deleteLink } = useDeleteLink();
  const { mutate: favoriteLink } = useFavoriteLink();

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

 const handleDelete = () => {
    const confirm = window.confirm("Are you sure? You want to delete this link.")
    if(confirm){
      deleteLink(_id)
    }
  }

  const handleEdit = () => {
    const newTags = tags.map(t => ({
      label: t.name,
      value: t._id
    }));
    const newCategory = { label: category.name, value: category._id }
    onEdit({ id: _id, favicon, url, title, description, category: newCategory, tags: newTags })

  }

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <div className="w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg p-3 transition-all hover:shadow-sm flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden">

      {/* Left: favicon + title + name */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <img
          src={favicon}
          loading="lazy"
          alt="favicon"
          className="w-6 h-6 object-contain rounded-full shrink-0 mt-1"
        />
        <div className="min-w-0">
          <h3
            title={title}
            className="text-sm font-semibold text-slate-900 dark:text-neutral-200 truncate"
          >
            {title}
          </h3>
          <p
            title={description}
            className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-1"
          >
            {description}
          </p>
        </div>
      </div>

      {/* Center: URL + copy */}
      <div className="flex items-center gap-2 md:justify-center flex-1 min-w-0">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate max-w-full"
          title={url}
        >
          {url}
        </a>
        {copied ? (
          <span className="text-xs text-green-600 font-medium select-none shrink-0">
            Copied!
          </span>
        ) : (
          <button
            onClick={handleCopy}
            title="Copy link"
            className="p-1 hover:bg-slate-100 dark:hover:bg-neutral-600 rounded-md shrink-0"
          >
            <Copy01Icon size={16} className="text-slate-500 dark:text-neutral-300" />
          </button>
        )}
      </div>

      {/* Right: Actions + Category + Tags */}
      <div className="flex flex-col items-start md:items-end gap-2 flex-none w-full md:w-auto">
        {/* Action buttons */}
        <div className="flex gap-2">
          <button onClick={() => favoriteLink(_id)} title={isFavorite ? "Unstar" : "Star"} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-600">
            {isFavorite ?
              <StarOffIcon size={16} className="text-slate-500 dark:text-neutral-300" />
              :
              <StarIcon size={16} className="text-slate-500 dark:text-neutral-300" />
            }
          </button>
          <button onClick={handleEdit} title="Edit" className="p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-600">
            <Edit02Icon size={16} className="text-slate-500 dark:text-neutral-300" />
          </button>
          <button onClick={handleDelete} title="Delete" className="p-1 rounded hover:bg-slate-100 dark:hover:bg-red-500/20">
            <Delete01Icon size={16} className="text-red-500" />
          </button>
        </div>

        {/* Tags and category */}
        <div className="flex flex-wrap gap-1 justify-start md:justify-end max-w-full">
          {category && (
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-neutral-600 dark:text-neutral-300 text-slate-700 rounded-md">
              {category.name}
            </span>
          )}
          {tags.map((tag, idx) => (
            <span
              key={tag._id}
              className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-600/40 text-emerald-300 rounded-md"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkCardList;
