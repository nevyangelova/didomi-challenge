'use client';
/**
 * Why Context?
 * 1. Global State: Consents data is needed across multiple components (pagination, form)
 * 2. Cache Management: We need to maintain a cache of fetched pages to avoid unnecessary API calls
 * 3. Shared Logic: Pagination, loading states, and error handling
 * 4. SSR Integration: We can hydrate the context with server-side data while keeping client-side updates
 * 5. Performance: Prevents prop drilling and unnecessary re-renders
 *
 * Alternative Approaches Considered:
 * - Redux: Overkill for this simple state management
 * - React Query: Could work but adds complexity for simple pagination
 * - Local State + Props: Would require prop drilling and duplicate logic
 * - Server Components: Would lose client-side interactivity for pagination
 */

import React, {createContext, useContext, useState, useCallback} from 'react';
import {getConsents} from '@/services/consents';
import {Consent} from '@/types/consents';

/**
 * Context Type Definition
 * - page and pageSize: Required for pagination UI and API calls
 * - consentsCache: Stores fetched pages to prevent redundant API calls
 * - total: Needed for pagination calculations and UI
 * - loading and error: For handling async states and user feedback
 * - fetchPage: Core pagination function
 * - refreshAndGoToLastPage: Special case for new consents
 */
interface ConsentsContextType {
    page: number;
    setPage: (page: number) => void;
    pageSize: number;
    consentsCache: Record<number, Consent[]>;
    total: number;
    loading: boolean;
    error: string | null;
    fetchPage: (page: number) => Promise<void>;
    refreshAndGoToLastPage: () => Promise<void>;
}

const ConsentsContext = createContext<ConsentsContextType | undefined>(
    undefined
);

/**
 * ConsentsProvider
 *
 * Props:
 * - initialPage: Starting page
 * - initialData: SSR data to hydrate the cache
 * - initialTotal: Total count from SSR
 *
 * Why these props?
 * - Enables SSR hydration while maintaining client-side updates
 * - Allows testing with mock data
 * - Provides flexibility for different initial states
 */
export function ConsentsProvider({
    children,
    initialPage = 1,
    initialData = {},
    initialTotal = 0,
}: {
    children: React.ReactNode;
    initialPage?: number;
    initialData?: Record<number, Consent[]>;
    initialTotal?: number;
}) {
    // Why useState instead of useReducer?
    // - Simpler state shape
    // - Fewer actions
    // - Easier to understand and maintain
    const [page, setPage] = useState(initialPage);
    const [pageSize] = useState(2);
    const [consentsCache, setConsentsCache] =
        useState<Record<number, Consent[]>>(initialData);
    const [total, setTotal] = useState(initialTotal);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * fetchPage
     * 1. Cache First: Checks cache before making API call
     * 2. Loading States: Manages loading and error states
     * 3. Cache Update: Updates cache with new data
     * 4. Total Update: Keeps total count in sync
     *
     * Why useCallback?
     * - Prevents unnecessary re-renders
     * - Stable reference for dependencies
     * - Required for useEffect dependencies
     */
    const fetchPage = useCallback(
        async (targetPage: number) => {
            // Cache hit - just update page
            if (consentsCache[targetPage]) {
                setPage(targetPage);
                return;
            }

            // Cache miss - fetch from API
            setLoading(true);
            setError(null);
            try {
                const {data, total} = await getConsents(targetPage, pageSize);
                setConsentsCache((prev) => ({...prev, [targetPage]: data}));
                setTotal(total);
                setPage(targetPage);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch consents');
            } finally {
                setLoading(false);
            }
        },
        [consentsCache, pageSize]
    );

    /**
     * refreshAndGoToLastPage
     *
     * Why this special function?
     * 1. UX: When adding a consent, user expects to see it immediately
     * 2. Data Consistency: Need to update total count and fetch latest page
     * 3. Navigation: Automatically go to the page where new consent appears
     *
     * Implementation Details:
     * 1. First fetch total to calculate last page
     * 2. Then fetch last page's data
     * 3. Update cache and current page
     *
     * Why not just refresh current page?
     * - New consent might be on a different page
     * - User expects to see their new consent
     */
    const refreshAndGoToLastPage = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Get fresh total to calculate last page
            const {total: newTotal} = await getConsents(1, pageSize);
            setTotal(newTotal);

            // Calculate and fetch last page
            const lastPage = Math.ceil(newTotal / pageSize);
            const {data} = await getConsents(lastPage, pageSize);

            // Update cache and current page
            setConsentsCache((prev) => ({...prev, [lastPage]: data}));
            setPage(lastPage);
        } catch (err: any) {
            setError(err.message || 'Failed to refresh consents');
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    return (
        <ConsentsContext.Provider
            value={{
                page,
                setPage: fetchPage,
                pageSize,
                consentsCache,
                total,
                loading,
                error,
                fetchPage,
                refreshAndGoToLastPage,
            }}
        >
            {children}
        </ConsentsContext.Provider>
    );
}

export function useConsentsContext() {
    const ctx = useContext(ConsentsContext);
    if (!ctx)
        throw new Error(
            'useConsentsContext must be used within a ConsentsProvider'
        );
    return ctx;
}
