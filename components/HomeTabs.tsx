'use client';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Sidebar from './Sidebar';
import ConsentsListWithPagination from './ConsentsListWithPagination';
import GiveConsentForm from './GiveConsentForm';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export default function HomeTabs() {
    const [tab, setTab] = useState('give-consent');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{display: 'flex', minHeight: '100vh'}}>
            {!isMobile && <Sidebar activeTab={tab} onTabChange={setTab} />}
            {isMobile && <Sidebar activeTab={tab} onTabChange={setTab} />}
            <Box
                component='main'
                sx={{
                    flex: 1,
                    p: {xs: 2, sm: 4},
                    pt: {xs: 8, sm: 4},
                }}
            >
                {tab === 'give-consent' ? (
                    <GiveConsentForm
                        onSuccess={() => setTab('collected-consents')}
                    />
                ) : (
                    <ConsentsListWithPagination />
                )}
            </Box>
        </Box>
    );
}
