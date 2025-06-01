import { Copy01Icon, Delete01Icon, Edit02Icon, StarIcon, StarOffIcon } from "hugeicons-react";
import React, { useEffect, useState } from "react";
import useDeleteLink from "../../../hooks/useDeleteLink";
import useFavoriteLink from "../../../hooks/useFavoriteLink";

const LinkCard = ({ _id, favicon, url, title, description, category, tags = [], onEdit, isFavorite }) => {
  const [copied, setCopied] = useState(false);

  const { mutate: deleteLink } = useDeleteLink();
  const { mutate: favoriteLink } = useFavoriteLink();


  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);
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

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDoubleClick={() => favoriteLink(_id)}
      className="relative group w-full bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 rounded-lg p-4 transition-all hover:shadow-sm overflow-hidden"
    >
      {/* Top Right Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
        <button onClick={() => favoriteLink(_id)} title={isFavorite? "Unstar" : "Star"} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-600">
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

      {/* Header */}
      <div className="flex items-start gap-3">
        <img
          src={favicon}
          loading="lazy"
          alt="favicon"
          className="w-6 h-6 object-contain mt-1 rounded-full shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3
            title={title}
            className="text-base font-semibold text-slate-800 dark:text-neutral-200 truncate"
          >
            {title}
          </h3>
          <p
            title={description}
            className="text-sm text-slate-500 dark:text-neutral-400 truncate"
          >
            {description}
          </p>
        </div>
      </div>

      {/* URL with copy */}
      <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all flex-1 min-w-0"
        >
          {url}
        </a>
        {copied ? (
          <span className="text-xs text-green-600 font-medium select-none shrink-0 py-1">Copied!</span>
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

      {/* Divider */}
      <hr className="my-4 border-slate-200 dark:border-neutral-600" />

      {/* Category & Tags */}
      <div className="flex items-center flex-wrap gap-2 overflow-hidden">
        {category && (
          <span
            title="Category"
            className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-neutral-600 dark:text-neutral-300 text-slate-700 rounded-md"
          >
            {category.name}
          </span>
        )}

        {tags.map((tag, idx) => (
          <span
            key={tag._id}
            className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-600/40 text-emerald-600 dark:text-emerald-300 rounded-md"
          >
            #{tag.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LinkCard;
