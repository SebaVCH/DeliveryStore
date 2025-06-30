import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import PersonIcon from '@mui/icons-material/Person';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

type UserType = 'admin' | 'repartidor';

interface MenuItem {
    key: string;
    label: string;
    icon: React.ReactNode;
}

interface PersistentDrawerLeftProps {
    sections: Record<string, React.ReactNode>;
    userType: UserType;
}

const menuConfigs: Record<UserType, { title: string; items: MenuItem[] }> = {
    admin: {
        title: 'Panel de Administración',
        items: [
            { key: 'usuarios', label: 'Usuarios', icon: <PersonIcon /> },
            { key: 'vendedores', label: 'Vendedores', icon: <ShoppingBagIcon /> },
            { key: 'productos', label: 'Productos', icon: <InboxIcon /> },
            { key: 'envios', label: 'Envíos', icon: <MarkunreadMailboxIcon /> },
            { key: 'ordenes', label: 'Órdenes', icon: <LocalShippingIcon /> },
            { key: 'transacciones', label: 'Transacciones', icon: <PointOfSaleIcon /> },
        ]
    },
    repartidor: {
        title: 'Panel de Repartidor',
        items: [
            { key: 'ordenesDisponibles', label: 'Órdenes Disponibles', icon: <AssignmentIcon /> },
            { key: 'misEnvios', label: 'Mis Envíos', icon: <DeliveryDiningIcon /> },
        ]
    }
};

export default function PersistentDrawerLeft({ sections, userType }: PersistentDrawerLeftProps) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const config = menuConfigs[userType];
    const [selectedSection, setSelectedSection] = React.useState<string>(config.items[0].key);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const handleLogout = () => {
        setToken(null);
        navigate('/Login');
    };

    return (
        <Box sx={{ display: 'flex'}}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx ={{backgroundColor: '#79CB3A'}}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {config.title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List sx={{ flexGrow: 1 }}>
                    {config.items.map((item) => (
                        <ListItem key={item.key} disablePadding>
                            <ListItemButton
                                selected={selectedSection === item.key}
                                onClick={() => setSelectedSection(item.key)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout} sx={{ color: 'red' }}>
                            <ListItemIcon sx={{ color: 'red' }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Cerrar Sesión" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                {sections[selectedSection]}
            </Main>
        </Box>
    );
}