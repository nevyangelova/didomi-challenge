'use client';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

const navItems = [
    {label: 'Give consent', key: 'give-consent'},
    {label: 'Collected consents', key: 'collected-consents'},
];

export default function Sidebar({
    activeTab,
    onTabChange,
}: {
    activeTab: string;
    onTabChange: (tab: string) => void;
}) {
    return (
        <Box sx={{width: 200, borderRight: '1px solid #ccc', p: 2}}>
            <List sx={{p: 0, m: 0}}>
                {navItems.map((item) => (
                    <ListItem key={item.key} disablePadding sx={{mb: 0.5}}>
                        <Button
                            fullWidth
                            onClick={() => onTabChange(item.key)}
                            sx={{
                                backgroundColor:
                                    activeTab === item.key
                                        ? '#e3f0ff'
                                        : 'transparent',
                                fontWeight:
                                    activeTab === item.key ? 'bold' : 'normal',
                                color: '#222',
                                borderRadius: 1,
                                textTransform: 'none',
                                px: 2,
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: '#e3f0ff',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            {item.label}
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
