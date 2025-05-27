'use client';
import React, {createContext, useContext, useState, useCallback} from 'react';
import {getConsents, Consent} from '@/services/consents';

interface ConsentsContextType {
    page: number;
    setPage: (page: number) => void;
    pageSize: number;
    consentsCache: Record<number, Consent[]>;
    total: number;
    loading: boolean;
    error: string | null;
    fetchPage: (page: number) => Promise<void>;
}

const ConsentsContext = createContext<ConsentsContextType | undefined>(
    undefined
);

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
    const [page, setPage] = useState(initialPage);
    const [pageSize] = useState(2);
    const [consentsCache, setConsentsCache] =
        useState<Record<number, Consent[]>>(initialData);
    const [total, setTotal] = useState(initialTotal);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPage = useCallback(
        async (targetPage: number) => {
            if (consentsCache[targetPage]) {
                setPage(targetPage);
                return;
            }
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
