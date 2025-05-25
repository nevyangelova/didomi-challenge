'use client';
import {useEffect, useState} from 'react';
import Sidebar from '../components/Sidebar';
import ConsentsListWithPagination from '../components/ConsentsListWithPagination';

function GiveConsentFormPlaceholder() {
    return (
        <div style={{border: '1px solid #ccc', borderRadius: 8, padding: 24}}>
            <h2>Give Consent</h2>
            <div>Give Consent form will go here.</div>
        </div>
    );
}

export default function HomePage() {
    const [tab, setTab] = useState('collected-consents');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setTab(hash || 'collected-consents');
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
                    <GiveConsentFormPlaceholder />
                ) : (
                    <ConsentsListWithPagination />
                )}
            </main>
        </div>
    );
}
