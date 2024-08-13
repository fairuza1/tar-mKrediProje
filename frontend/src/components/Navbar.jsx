import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios'u import edin
import Logo from '../assets/logo.png'; // Logo dosyasının yolu

const pages = ['Add Land', 'View Lands', 'Contact', 'Signup', 'Login', 'Land List'];

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => { // setIsLoggedIn'i burada alıyoruz
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate(); // useNavigate hook'u ile yönlendirme

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem('userId'); // localStorage'dan kullanıcı bilgilerini temizleyin
            setIsLoggedIn(false); // Kullanıcı çıkış yaptıktan sonra isLoggedIn durumunu false olarak ayarlayın
            navigate('/login'); // Kullanıcıyı login sayfasına yönlendirin
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    return (
        <AppBar position="static" sx={{ backgroundColor: 'green' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box
                        component="img"
                        src={Logo}
                        alt="Ekim Rehberi Logo"
                        sx={{ height: 40, marginRight: 2 }}
                    />

                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/home"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            textDecoration: 'none',
                            color: 'white',
                            fontFamily: 'Poppins, sans-serif',

                        }}
                    >
                        Ekim Rehberi
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                                fontSize:'100px'
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif'}}>
                                        <Link to={`/${page.toLowerCase().replace(/ /g, '-')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {page}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, color: 'white', fontFamily: 'Poppins, sans-serif' }}
                    >
                        Ekim Rehberi
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'Poppins, sans-serif' }}
                                component={Link} to={`/${page.toLowerCase().replace(/ /g, '-')}`}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' ,

                            }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Profile
                                    </Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Settings
                                    </Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Logout
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Navbar;
