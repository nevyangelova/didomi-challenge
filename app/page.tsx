'use client';
import {useEffect, useState} from 'react';
import Sidebar from '../components/Sidebar';
import ConsentsListWithPagination from '../components/ConsentsListWithPagination';
import GiveConsentForm from '../components/GiveConsentForm';

export default function HomePage() {
    const [tab, setTab] = useState('give-consent');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setTab(hash || 'give-consent');
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <div style={{display: 'flex', minHeight: '100vh'}}>
            <Sidebar />
            <main style={{flex: 1, padding: 32}}>
                {tab === 'give-consent' ? (
                    <GiveConsentForm onSuccess={() => { window.location.hash = 'collected-consents'; }} />
                ) : (
                    <ConsentsListWithPagination />
                )}
            </main>
        </div>
    );
}
