import { Cancel01Icon, ClothesIcon } from "hugeicons-react";
import React, { useState, useEffect } from "react"
import Select from "react-select";

import { fetchCategories } from "../../../utils/CategoriesFunc";
import { useQuery } from "@tanstack/react-query";
import CustomSelect from "../../../components/CustomSelect";
import useDarkMode from "../../../hooks/useDarkMode";
import { fetchTags } from "../../../utils/TagsFunc";

const FilterModal = ({
  isOpen,
  onClose,
  clearFilters,
  applyFilters,
  filters, 
  setFilters
}) => {
  if (!isOpen) return null;


  
  // Fetch categories and tags
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'], 
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
  const { data: tagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    staleTime: 5 * 60 * 1000,
  });


  // filtersat options for react-select
   const categoryOptions = (categoriesData?.data || []).map(cat => ({ value: cat.slug, label: cat.name }));
    const tagOptions = (tagsData?.data || []).map(tag => ({ value: tag.slug, label: tag.name }));

  // --- react-select Handlers ---
  const handleCategoryChange = (selectedOption, actionMeta) => {
    if (actionMeta.action === 'select-option' || actionMeta.action === 'create-option') {
      setFilters(prev => ({ ...prev, category: selectedOption ? selectedOption : '' }));
    } else if (actionMeta.action === 'clear') {
      setFilters(prev => ({ ...prev, category: '' }));
    }
  };

 const handleTagsChange = (selectedOptions, actionMeta) => {
        setFilters(prev => ({ ...prev, tags: selectedOptions }));
    };

  // Prepare current values for react-select
  const currentCategoryValue = filters.category ? { value: filters.category.value, label: filters.category.label } : null;
  const currentTagsValue = filters.tags.map(tag => ({ value: tag.value, label: tag.label }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-600 rounded-2xl shadow-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-red-500 transition-colors"
          aria-label="Close filter modal"
        >
          <Cancel01Icon className="w-5 h-5" />
        </button>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Filter Links
        </h2>

        {/* Select Fields */}
        <div className="space-y-4">
          {/* Category */}
          <CustomSelect
            id="category-select"
            label="Category"
            placeholder="Select category..."
            isMulti={false}
            isLoading={isLoadingCategories}
            value={currentCategoryValue}
            onChange={handleCategoryChange}
            options={categoryOptions}
          />

          {/* Tags */}
          <CustomSelect
            id="tags-select"
            label="Tags"
            placeholder="Select tags..."
            isMulti
            isLoading={isLoadingTags}
            value={currentTagsValue}
            onChange={handleTagsChange}
            options={tagOptions}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-300 dark:border-neutral-800 pt-4">
          <button
            onClick={clearFilters}
            className="text-sm text-neutral-500 hover:text-red-600 transition"
          >
            Clear All
          </button>
          <button
            onClick={()=>applyFilters(filters)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>

  );
};

export default FilterModal;
