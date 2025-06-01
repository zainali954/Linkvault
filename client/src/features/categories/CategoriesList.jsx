import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../../utils/CategoriesFunc';
import {
  Cancel01Icon,
  Delete01Icon,
  DownloadCircle01Icon,
  Edit02Icon,
} from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import useDeleteCategory from '../../hooks/useDeleteCategory';
import useUpdateCategory from '../../hooks/useUpdateCategory';
import useCreateCategory from '../../hooks/useCreateCategory';
import { toast } from 'react-toastify';

const SkeletonCard = () => (
  <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 shadow-sm animate-pulse space-y-2">
    <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
  </div>
);

const CategoryList = () => {
  const [deletingId, setDeletingId] = useState(null);
  const [editCategory, setEditCategory] = useState({ id: '', name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const navigate = useNavigate();

  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: createCategory, isLoading: creating } = useCreateCategory();

  const { data: categoriesData, isPending, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredCategories = useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data.filter(cat =>
      cat.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [categoriesData, debouncedSearch]);

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure? You want to delete this category. All tasks belong to this category will be assigned to Uncategorized.")
    if (confirm) {
      setDeletingId(id);
      deleteCategory(id);
    }
  };

  const handleSave = (id) => {
    updateCategory({ id, name: editCategory.name });
    setEditCategory({ id: '', name: '' });
  };

  const handleCreate = () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    createCategory({ name: newCategoryName }, {
      onSuccess: () => setNewCategoryName(''),
    });
  };

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">All Categories</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded-md border border-neutral-300 w-full md:w-64 bg-white dark:bg-neutral-900 text-sm dark:border-neutral-600 dark:text-neutral-300"
          />
        </div>
      </div>

      {/* New Category */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="px-3 py-2 rounded-md border border-neutral-300 w-full md:w-64 bg-white dark:bg-neutral-900 text-sm dark:border-neutral-600 dark:text-neutral-300"
        />
        <button
          onClick={handleCreate}
          disabled={creating}
          className="px-4 py-2  rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Add
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {isPending ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : isError ? (
          <p className="text-red-500 dark:text-red-400 col-span-full">Failed to load categories.</p>
        ) : filteredCategories.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400 col-span-full">No categories found.</p>
        ) : (
          filteredCategories.map((cat) => {
            const isEditing = editCategory.id === cat._id;

            return (
              <div
                key={cat._id}
                onClick={() => !isEditing && navigate(`/links?category=${cat.slug}`)}
                className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 group hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-start gap-2 group">
                  <div className="flex-1 cursor-pointer">
                    {isEditing ? (
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editCategory.name}
                          onChange={(e) =>
                            setEditCategory((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Updated name"
                          className="px-2 rounded-md text-neutral-400 w-full"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(cat._id);
                          }}
                          title="Save"
                          className="text-sm p-1 rounded hover:bg-green-100 dark:hover:bg-green-700/30"
                        >
                          <DownloadCircle01Icon size={16} className="text-green-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditCategory({ id: '', name: '' });
                          }}
                          title="Cancel"
                          className="text-sm p-1 rounded hover:bg-green-100 dark:hover:bg-green-700/30"
                        >
                          <Cancel01Icon size={16} className="text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <h4
                        title={
                          cat.name.toLowerCase() === "uncategorized"
                            ? "Default category cannot be edited or deleted."
                            : ""
                        }
                        className="text-md font-medium text-neutral-800 dark:text-neutral-100"
                      >
                        {cat.name}
                      </h4>

                    )}
                  </div>
                  {!isEditing && cat.name.toLowerCase() !== "uncategorized" && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditCategory({ id: cat._id, name: cat.name });
                        }}
                        title="Edit"
                        className="text-sm p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-700/30"
                      >
                        <Edit02Icon size={16} className="text-blue-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cat._id);
                        }}
                        title="Delete"
                        className="text-sm p-1 rounded hover:bg-red-100 dark:hover:bg-red-700/30"
                        disabled={deletingId === cat._id}
                      >
                        <Delete01Icon size={16} className="text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryList;
