import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import SwitchLanguage from './SwitchLanguage';
import Loader from './Loader';

type Props = {
    children: JSX.Element;
};

const navItems = [
    { label: 'Boutiques', path: '/' },
    { label: 'Produits', path: '/product' },
    { label: 'Catégories', path: '/category' },
];

const Layout = ({ children }: Props) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)'); // Change breakpoint as needed
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawerContent = (
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton onClick={() => navigate(item.path)}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <AppBar component="nav">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        Gestion de boutiquesss
                    </Typography>
                    {!isMobile && (
                        <Box>
                            {navItems.map((item) => (
                                <Button key={item.label} sx={{ color: '#fff' }} onClick={() => navigate(item.path)}>
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}
                    <SwitchLanguage />
                </Toolbar>
            </AppBar>

            {/* Drawer for Mobile */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }} // Improve mobile performance
            >
                {drawerContent}
            </Drawer>

            <Loader />
            <Box sx={{ mt: 8 }}>{children}</Box> {/* Add margin for AppBar */}
        </div>
    );
};

export default Layout;
