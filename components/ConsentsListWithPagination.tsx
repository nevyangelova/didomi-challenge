'use client';
import {useEffect, useState} from 'react';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import type {Consent} from '../app/api/consents/route';

const PAGE_SIZE = 2;

export default function ConsentsListWithPagination() {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<Consent[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/consents?page=${page}&pageSize=${PAGE_SIZE}`)
            .then((res) => res.json())
            .then((json) => {
                setData(json.data);
                setTotal(json.total);
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
            ) : (
                <List>
                    {data.map((consent, idx) => (
                        <ListItem key={idx} divider>
                            <strong>{consent.name}</strong> - {consent.email} -{' '}
                            {consent.consentGivenFor.join(', ')}
                        </ListItem>
                    ))}
                </List>
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
