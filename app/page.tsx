'use client';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Sidebar from '../components/Sidebar';
import ConsentsListWithPagination from '../components/ConsentsListWithPagination';
import GiveConsentForm from '../components/GiveConsentForm';

export default function HomePage() {
    const [tab, setTab] = useState('give-consent');

    return (
        <Box sx={{display: 'flex', minHeight: '100vh'}}>
            <Sidebar activeTab={tab} onTabChange={setTab} />
            <Box component='main' sx={{flex: 1, p: 4}}>
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
