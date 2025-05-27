'use client';
import {useEffect, useRef} from 'react';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ConsentsTable from './ConsentsTable';
import {useConsentsContext} from '@/contexts/ConsentsContext';
import CircularProgress from '@mui/material/CircularProgress';

export default function ConsentsListWithPagination() {
    const {
        page,
        setPage,
        pageSize,
        consentsCache,
        total,
        loading,
        error,
        fetchPage,
    } = useConsentsContext();

    // Keep track of the last available data to show while loading and avoid page flickering
    const lastDataRef = useRef(consentsCache[page] || []);
    const data = consentsCache[page] || lastDataRef.current;
    useEffect(() => {
        if (consentsCache[page]) {
            lastDataRef.current = consentsCache[page];
        }
    }, [consentsCache, page]);

    useEffect(() => {
        if (!consentsCache[page]) {
            fetchPage(page);
        }
    }, [page, consentsCache, fetchPage]);

    const pageCount = Math.ceil(total / pageSize);
    const isInitialPage = page === 1;
    const showInitialLoading = isInitialPage && loading && !consentsCache[1];

    return (
        <Box sx={{position: 'relative'}}>
            {error && <Typography color='error'>{error}</Typography>}
            {showInitialLoading ? (
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    minHeight={200}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <ConsentsTable consents={data} />
            )}
            <Box display='flex' justifyContent='center' mt={2}>
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color='primary'
                />
            </Box>
        </Box>
    );
}
