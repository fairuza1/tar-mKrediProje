import React, { useEffect, useState } from 'react';
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
import { Link, useNavigate, useLocation } from 'react-router-dom'; // useLocation import et
import axios from 'axios';
import Logo from '../assets/logo.png'; // Logo dosyasının yolu

const pages = [
    { title: 'Arazi Ekle', link: 'add-land' },
    { title: 'Araziler Listesi', link: 'land-list' },
    { title: 'Ekim Yap', link: 'sowings' },
    { title: 'Ekim Listesi', link: 'sowing-list' },
    { title: 'Hasat Listesi', link: 'harvest' },
    { title: 'Değerlendirme Listesi', link: 'rating-list' }
];

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [username, setUsername] = useState(''); // Kullanıcı adını tutmak için state
    const navigate = useNavigate();
    const location = useLocation(); // Mevcut sayfayı almak için useLocation hook'u kullanılıyor

    // localStorage'den username'i çek
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

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
            localStorage.removeItem('username'); // username'i localStorage'dan kaldır
            setIsLoggedIn(false); // Kullanıcı çıkış yaptıktan sonra isLoggedIn durumunu false olarak ayarlayın
            navigate('/login'); // Kullanıcıyı login sayfasına yönlendirin
        } catch (error) {
            console.error('Çıkış yapma hatası:', error);
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'green' }}>
            <Container maxWidth="xxl">
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
                            aria-label="menu"
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
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.link} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <Link to={`/${page.link}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {page.title}
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
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                            color: 'white',
                            fontFamily: 'Poppins, sans-serif'
                        }}
                    >
                        Ekim Rehberi
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.link}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    backgroundColor: location.pathname === `/${page.link}` ? 'white' : 'transparent', // Arkaplan rengi beyaz
                                    color: location.pathname === `/${page.link}` ? 'green' : 'white', // Yazı rengi yeşil
                                    display: 'block',
                                    fontFamily: 'Poppins, sans-serif',
                                    '&:hover': { // Hover olduğunda arkaplan rengi beyaz, yazı rengi yeşil
                                        backgroundColor: 'white',
                                        color: 'green'
                                    }
                                }}
                                component={Link}
                                to={`/${page.link}`}
                            >
                                {page.title}
                            </Button>
                        ))}
                    </Box>


                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', ml: 'auto' }}> {/* ml: 'auto' ile sağa kaydır */}
                        {username && (
                            <Typography sx={{ fontSize:30, color: 'white', marginRight: '10px', fontWeight: 'bold' ,backgroundColor:"b" }}> {/* fontWeight: 'bold' ile kalın */}
                                Merhaba , {username}
                            </Typography>
                        )}
                        <Tooltip title="Ayarlar">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Kullanıcı Avatarı" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
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
                                        Profil
                                    </Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Ayarlar
                                    </Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Typography textAlign="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Çıkış Yap
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
