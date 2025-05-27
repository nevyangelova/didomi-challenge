'use client';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {useState} from 'react';

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleTabClick = (tab: string) => {
        onTabChange(tab);
        if (isMobile) {
            setDrawerOpen(false);
        }
    };

    const navContent = (
        <List sx={{p: 0, m: 0}}>
            {navItems.map((item) => (
                <ListItem key={item.key} disablePadding sx={{mb: 0.5}}>
                    <Button
                        fullWidth
                        onClick={() => handleTabClick(item.key)}
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
    );

    if (isMobile) {
        return (
            <>
                <IconButton
                    onClick={() => setDrawerOpen(true)}
                    sx={{position: 'fixed', top: 16, left: 16, zIndex: 1200}}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor='left'
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >
                    <Box sx={{width: 250, p: 2}}>{navContent}</Box>
                </Drawer>
            </>
        );
    }

    return (
        <Box sx={{width: 200, borderRight: '1px solid #ccc', p: 2}}>
            {navContent}
        </Box>
    );
}
