'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

const navItems = [
    {label: 'Give consent', href: '/#give-consent'},
    {label: 'Collected consents', href: '/#collected-consents'},
];

export default function Sidebar() {
    const pathname = usePathname();
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
                                background:
                                    pathname === item.href
                                        ? '#e3f0ff'
                                        : 'transparent',
                                fontWeight:
                                    pathname === item.href ? 'bold' : 'normal',
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
