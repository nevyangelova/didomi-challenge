'use client';
import {useEffect, useState} from 'react';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ConsentsTable from './ConsentsTable';
import {getConsents, Consent} from '@/services/consents';

const PAGE_SIZE = 2;

export default function ConsentsListWithPagination() {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<Consent[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getConsents(page, PAGE_SIZE)
            .then(({data, total}) => {
                setData(data);
                setTotal(total);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [page]);

    const pageCount = Math.ceil(total / PAGE_SIZE);

    return (
        <Box>
            <Typography variant='h5' gutterBottom>
                Collected Consents
            </Typography>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color='error'>{error}</Typography>
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
