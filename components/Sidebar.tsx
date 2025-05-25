'use client';
import Link from 'next/link';

const navItems = [
    {label: 'Give consent', href: '/#give-consent'},
    {label: 'Collected consents', href: '/#collected-consents'},
];

export default function Sidebar() {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    return (
        <nav style={{width: 200, borderRight: '1px solid #ccc', padding: 16}}>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                {navItems.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            style={{
                                display: 'block',
                                padding: '12px 8px',
                                background: hash === item.href.replace('/','') ? '#e3f0ff' : 'transparent',
                                fontWeight: hash === item.href.replace('/','') ? 'bold' : 'normal',
                                color: '#222',
                                textDecoration: 'none',
                                borderRadius: 4,
                                marginBottom: 4,
                            }}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
