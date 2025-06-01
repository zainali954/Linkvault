import axios from 'axios';
import { Cancel01Icon, Loading03Icon, Tick01Icon } from 'hugeicons-react';
import  { useState, useEffect, useRef } from 'react';
import faviconPlaceholder from '../../../assets/favicon-placeholder.ico';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../../../utils/CategoriesFunc';
import { fetchTags } from '../../../utils/TagsFunc';
import useCreateLink from '../../../hooks/useCreateLink';
import useCreateTag from '../../../hooks/useCreateTag';
import useUpdateLink from '../../../hooks/useUpdateLink';
import useCreateCategory from '../../../hooks/useCreateCategory';
import CustomSelect from '../../../components/CustomSelect';
import api from '../../../utils/api';

// --- Metadata Fetch Function  --- 
async function fetchLinkMetadata(url) {
    const res = await api.post("/get-web-data", {
        url: url
    });
    return {
        title: res.data.data.title,
        description: res.data.data.description,
        favicon: res.data.data.favicon,
    };
}

const LinkForm = ({initialData = {},  onCancel }) => {
    const { mutate: createLink, isPending: isSaving } = useCreateLink();
    const { mutate: updateLink, isPending: isUpdating } = useUpdateLink();
    const { mutate: createTag } = useCreateTag();
    const { mutate: createCategory } = useCreateCategory();
    const [form, setForm] = useState({
        url: initialData.url || '',
        title: initialData.title || '',
        description: initialData.description || '',
        favicon: initialData.favicon || '',
        category: initialData.category || '',
        tags: initialData.tags || [],
    });

    const [linkId, setlinkId] = useState(initialData.id || "")

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

    // Format options for react-select
    const categoryOptions = (categoriesData?.data || []).map(cat => ({ value: cat._id, label: cat.name }));
    const tagOptions = (tagsData?.data || []).map(tag => ({ value: tag._id, label: tag.name }));

    // State for metadata fetching
    const [isFetchingMeta, setIsFetchingMeta] = useState(false);
    const [fetchStatus, setFetchStatus] = useState('idle');
    const [fetchError, setFetchError] = useState('');
    const debounceTimeoutRef = useRef(null);

    // -----------------------------------------------------------------------

    // --- Autofill Logic --- 
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        const urlToFetch = form.url.trim();
        // *** FIX: Removed erroneous tab characters (\t) from startsWith checks ***
        if (urlToFetch && (urlToFetch.startsWith('http://') || urlToFetch.startsWith('https://'))) {
            debounceTimeoutRef.current = setTimeout(async () => {
                setIsFetchingMeta(true);
                setFetchStatus('loading');
                setFetchError('');
                try {
                    const metadata = await fetchLinkMetadata(urlToFetch);
                    setForm(prev => ({
                        ...prev,
                        // Only update if metadata is found and field wasn't manually edited (simple check)
                        title: metadata.title && prev.title === (initialData.title || '') ? metadata.title : prev.title,
                        description: metadata.description && prev.description === (initialData.description || '') ? metadata.description : prev.description,
                        favicon: metadata.favicon && prev.favicon === (initialData.favicon || '') ? metadata.favicon : prev.favicon,
                    }));
                    setFetchStatus('success');
                } catch (error) {
                    console.error("Metadata fetch error:", error);
                    setFetchError(error.response?.data?.message || error.message || 'Could not fetch link details.'); // Improved error message
                    setFetchStatus('error');
                } finally {
                    setIsFetchingMeta(false);
                }
            }, 800); // Debounce delay
        } else {
            // Reset status if URL is invalid or cleared
            setFetchStatus('idle'); 
            setIsFetchingMeta(false);
            setFetchError('');
        }
        // Cleanup function to clear timeout if URL changes before delay ends
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [form.url]); // Added initialData dependencies to autofill logic

    // --- Input Handlers --- 
    const handleUrlChange = (e) => {
        setForm(prev => ({ ...prev, url: e.target.value }));
    };
    const handleTitleChange = (e) => {
        setForm(prev => ({ ...prev, title: e.target.value }));
    };
    const handleDescriptionChange = (e) => {
        setForm(prev => ({ ...prev, description: e.target.value }));
    };

    // --- react-select Handlers ---
    const handleCategoryChange = (selectedOption, actionMeta) => {
        if (actionMeta.action === 'select-option' || actionMeta.action === 'create-option') {
            setForm(prev => ({ ...prev, category: selectedOption ? selectedOption : '' }));
        } else if (actionMeta.action === 'clear') {
            setForm(prev => ({ ...prev, category: '' }));
        }
    };

    const handleTagsChange = (selectedOptions, actionMeta) => {
        setForm(prev => ({ ...prev, tags: selectedOptions }));
    };

    const handleCategoryCreation = (inputValue) => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue) {
            createCategory({ name: trimmedValue });
        }
    };

    const handleTagCreation = (inputValue) => {
        createTag({ name: inputValue });

    }
    // -----------------------------

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const payload = {
            url: form.url,
            title: form.title,
            description: form.description,
            favicon: form.favicon,
            category: form.category?.value || null,
            tags: form.tags.map(tag => tag.value)
        };
        if (initialData.url) {
            updateLink({ id: linkId, data: payload }, {
                onSuccess: () => {
                    // Reset form on successful submission
                    setForm({
                        url: '',
                        title: '',
                        description: '',
                        favicon: '',
                        category: '',
                        tags: [],
                    });
                    onCancel()
                    setFetchStatus('idle'); // Reset fetch status
                },
                onError: (error) => {
                    console.error("Form submission error:", error);
                }
            })
        } else {
            createLink(payload, {
                onSuccess: () => {
                    // Reset form on successful submission
                    setForm({
                        url: '',
                        title: '',
                        description: '',
                        favicon: '',
                        category: '',
                        tags: [],
                    });
                    onCancel()
                    setFetchStatus('idle'); // Reset fetch status
                },
                onError: (error) => {
                    console.error("Form submission error:", error);
                }
            });
        }


    };

    // --- UI Components --- 
    const renderFetchStatusIcon = () => {
        if (fetchStatus === 'loading') return <Loading03Icon size={18} className='animate-spin' />;
        if (fetchStatus === 'success') return <Tick01Icon size={18} className='text-green-500' />;
        if (fetchStatus === 'error') return <Cancel01Icon size={18} className='text-red-500' />;
        return null;
    };

    // Prepare current values for react-select
    const currentCategoryValue = form.category ? { value: form.category.value, label: form.category.label } : null;
    const currentTagsValue = form.tags.map(tag => ({ value: tag.value, label: tag.label }));

    return (
        <div className="fixed inset-0 z-50 flex md:items-center md:justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
                <form
                    onSubmit={handleFormSubmit}
                    className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-lg border border-neutral-200 dark:border-neutral-700/80 space-y-6"
                >
                    <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
                        {initialData.url ? 'Edit Link' : 'Add New Link'} {/* Removed tabs */}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* === LEFT SIDE === */}
                        <div className="space-y-6">
                            {/* URL Input */}
                            <div className="space-y-2">
                                <label htmlFor="url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">URL *</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        id="url"
                                        name="url"
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-neutral-200 sm:text-sm disabled:opacity-50"
                                        value={form.url}
                                        onChange={handleUrlChange}
                                        required
                                        disabled={isFetchingMeta}
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {renderFetchStatusIcon()}
                                    </div>
                                </div>
                                {fetchStatus === 'error' && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fetchError}</p>
                                )}
                            </div>

                            {/* Category with react-select */}
                            <CustomSelect
                                id="category-select"
                                label="Category"
                                placeholder="Select or create category..."
                                isMulti={false}
                                isLoading={isLoadingCategories}
                                value={currentCategoryValue}
                                onChange={handleCategoryChange}
                                options={categoryOptions}
                                isCreatable={true}
                                onCreateOption={handleCategoryCreation}
                            />

                            {/* Tags with react-select */}
                            <CustomSelect
                                id="tags-select"
                                label="Tags"
                                placeholder="Select or create tags..."
                                isMulti
                                isLoading={isLoadingTags}
                                value={currentTagsValue}
                                onChange={handleTagsChange}
                                options={tagOptions}
                                isCreatable={true}
                                onCreateOption={handleTagCreation} 

                            />
                        </div>

                        {/* === RIGHT SIDE === */}
                        <div className="space-y-6">
                            {/* Icon Preview */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Favicon</label>
                                <img
                                    src={form.favicon || faviconPlaceholder}
                                    className="w-10 h-10 rounded border border-neutral-300 dark:border-neutral-600 object-contain bg-neutral-100 dark:bg-neutral-700"
                                    alt="Favicon Preview"
                                    onError={(e) => e.target.src = faviconPlaceholder}
                                />
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Website Title"
                                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-neutral-200 sm:text-sm"
                                    value={form.title}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Short description (optional)"
                                    rows={4}
                                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-neutral-200 sm:text-sm resize-none"
                                    value={form.description}
                                    onChange={handleDescriptionChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 dark:focus:ring-offset-neutral-900"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isFetchingMeta || isSaving || !form.url || !form.title}
                            className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-neutral-900"
                        >
                            {(isFetchingMeta || isSaving) ? <Loading03Icon size={18} className='animate-spin mr-2' /> : null}
                            {(isFetchingMeta) ? 'Fetching...' : (isSaving ? 'Saving...' : (initialData.url ? 'Save Changes' : 'Create Link'))} {/* Removed tabs */}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LinkForm;

