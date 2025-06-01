import {
    FilterIcon,
    GridTableIcon,
    LeftToRightListDashIcon,
    PlusSignIcon,
    Search01Icon
} from 'hugeicons-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import useMedia from 'use-media';
import { useInView } from 'react-intersection-observer'

import LinkCard from '../features/links/components/LinkCard';
import LinkCardList from '../features/links/components/LinkCardList';
import FilterModal from '../features/links/components/FilterModal';
import LinkForm from '../features/links/components/Linkform';
import SkeletonLinkCard from '../features/links/components/SkeletonLinkCard';
import SkeletonLinkCardList from '../features/links/components/SkeletonLinkCardList';

import { fetchLinks } from '../utils/LinksFunc';
import { LINKS_PAGE_LIMIT } from '../constants/constants';

const LinkDisplay = ({ title, showFavoritesOnly = false }) => {
    const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || 'grid');
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [search, setSearch] = useState("")
    const [filters, setFilters] = useState({ category: {}, tags: [] });

    const isMobile = useMedia({ maxWidth: 767 });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tags = searchParams.get('tags');
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('search') || '';

    const queryKey = showFavoritesOnly
        ? ['links', { category, tags, searchQuery, favorite: true }]
        : ['links', { category, tags, searchQuery, }];

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        setSearch("")
        navigate(`/links?${params.toString()}`);
    }

    const { data: linksData, hasNextPage, fetchNextPage, isFetchingNextPage, isPending, isError, error } = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 1 }) => fetchLinks(category, tags, showFavoritesOnly, searchQuery, pageParam),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.length === LINKS_PAGE_LIMIT ? allPages.length + 1 : undefined;
        },
        retry:false


    })

    const { ref, inView } = useInView({
        threshold: 1,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, inView, fetchNextPage])

    const handleViewChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem('viewMode', mode);
    };

    const applyFilters = (data) => {
        const categoryId = data.category?.value;
        const tags = data.tags?.map(tag => tag.value);

        const params = new URLSearchParams();
        if (categoryId) params.set('category', categoryId);
        if (tags.length > 0) params.set('tags', tags.join(','));

        navigate(`/links?${params.toString()}`);
        setIsFilterOpen(false);
    };

    const clearFilters = () => setFilters({ category: {}, tags: [] });

    const handleEditLink = (data) => {
        setInitialData(data);
        setIsCreateFormOpen(true);
    };

    const handleCancel = () => {
        setInitialData({});
        setIsCreateFormOpen(false);
    };

    useEffect(() => {
        if (isMobile && viewMode === 'list') {
            setViewMode('grid');
            localStorage.setItem('viewMode', 'grid');
        }
    }, [isMobile, viewMode]);


    return (
        <>
            {isCreateFormOpen && (
                <LinkForm
                    initialData={initialData}
                    setInitialData={setInitialData}
                    onCancel={handleCancel}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 w-full mt-4">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 w-full md:w-auto">
                        {title}
                    </h2>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 justify-end w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="search"
                                name="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search links..."
                                aria-label="Search content"
                                className="w-full sm:w-64 h-10 pl-4 pr-10 text-sm text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-neutral-400"
                            />

                            <button
                                type="button"
                                onClick={handleSearch}
                                className="absolute  top-1.5 right-2 p-1.5 rounded-md dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                                title="Search"
                            >
                                <Search01Icon size={16} className="stroke-neutral-500 dark:stroke-neutral-300" />
                            </button>
                        </div>


                        <div className="hidden md:flex items-center bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md overflow-hidden">
                            <button
                                title="Grid View"
                                onClick={() => handleViewChange('grid')}
                                className={`p-2 transition-all ${viewMode === 'grid'
                                    ? 'text-blue-600 bg-white dark:bg-neutral-800'
                                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 hover:text-blue-600'
                                    }`}
                            >
                                <GridTableIcon size={18} />
                            </button>
                            <button
                                title="List View"
                                onClick={() => handleViewChange('list')}
                                className={`p-2 border-l border-neutral-300 dark:border-neutral-600 transition-all ${viewMode === 'list'
                                    ? 'text-blue-600 bg-white dark:bg-neutral-800'
                                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 hover:text-blue-600'
                                    }`}
                            >
                                <LeftToRightListDashIcon size={18} />
                            </button>
                        </div>

                        <button
                            onClick={() => setIsFilterOpen(true)}
                            title="Filter"
                            className="p-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 hover:text-blue-600 border border-neutral-300 dark:border-neutral-600 rounded-md transition-all"
                        >
                            <FilterIcon size={18} />
                        </button>

                        <button
                            onClick={() => setIsCreateFormOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                        >
                            <PlusSignIcon size={18} />
                            Add Link
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {isError && (
                <div className="mt-4 p-4  text-red-600 ">
                    {error?.response?.data.message || 'Something went wrong while fetching links.'}
                </div>
            )}

            {/* Link Cards */}
            <div className={`mt-4 ${viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'flex flex-col gap-4'
                }`}>
                {isPending
                    ? Array(6).fill().map((_, idx) =>
                        viewMode === 'grid'
                            ? <SkeletonLinkCard key={idx} />
                            : <SkeletonLinkCardList key={idx} />
                    )
                    : linksData?.pages?.flatMap((page) => page.data)?.map((link, idx) =>
                        viewMode === 'grid'
                            ? <LinkCard key={link._id} {...link} onEdit={handleEditLink} />
                            : <LinkCardList key={link._id} {...link} onEdit={handleEditLink} />
                    )}
            </div>

            {!isPending && linksData?.pages?.every(p => p.data.length === 0) && (
                <div className="text-center text-neutral-500 dark:text-neutral-400 mt-6">
                    No links found. Try adjusting your filters.
                </div>
            )}


            <div ref={ref}>
                {isFetchingNextPage && <p>Loading...</p>}
            </div>

            {!hasNextPage &&
                !isPending &&
                linksData?.pages?.some((p) => p.data.length > 0) && (
                    <div className="text-center mt-6 text-sm text-neutral-500 dark:text-neutral-400">
                        🎉 You've reached the end! No more links to load.
                    </div>
                )}

            {isFilterOpen && (
                <FilterModal
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    clearFilters={clearFilters}
                    applyFilters={applyFilters}
                    filters={filters}
                    setFilters={setFilters}
                />
            )}
        </>
    );
};

export default LinkDisplay;
