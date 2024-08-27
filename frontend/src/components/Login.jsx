import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import backgroundImage from 'C:/Users/ercan kara/IdeaProjects/TarimKrediProjem/frontend/public/images/farm-background.jpg'; // Arka plan resminin yolu
import logoImage from 'C:/Users/ercan kara/IdeaProjects/TarimKrediProjem/frontend/public/images/leftphoto.jpg'; // Sol tablo resminin yolu

const theme = createTheme();

function Login({ setIsLoggedIn }) {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/login', { user, password }, { withCredentials: true });
            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('userId', data.userId);
                setIsLoggedIn(true);
                navigate('/home');
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            setError('An error occurred');
            console.error('Error:', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid
                container
                component="main"
                sx={{
                    height: '100vh',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CssBaseline />
                <Paper
                    elevation={6}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '80%',
                        maxWidth: '950px',
                        borderRadius: '12px', // Tüm köşeleri yuvarlar
                        borderTopLeftRadius:'100px',
                        borderBottomRightRadius:'100px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Sol Tablo: Resim */}
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            paddingLeft: 0,
                        }}
                    >
                        <img
                            src={logoImage}
                            alt="Logo"
                            style={{
                                maxWidth: '100%',
                                height: '100%',
                                display: 'block',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                width: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px',
                            }}
                        />
                    </Grid>
                    {/* Sağ Tablo: Giriş Formu */}
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4,
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            E-Koop Bilgi Sistemi
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="user"
                                label="Kullanıcı Adınız / TCKN"
                                name="user"
                                autoComplete="user"
                                autoFocus
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Şifrenizi Giriniz"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && (
                                <Typography variant="body2" color="error" align="center">
                                    {error}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TextField
                                    id="rememberMe"
                                    type="checkbox"
                                    sx={{ marginLeft: '8px', marginRight: '8px' }}
                                />
                                <Typography variant="body2">Beni Hatırla</Typography>
                                <Link href="#" variant="body2">
                                    Şifremi Unuttum
                                </Link>
                            </Box>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, bgcolor: '#6c757d' }}
                            >
                                Giriş Yap
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 1, mb: 2, bgcolor: '#dc3545' }}
                            >
                                E-Devlet ile Giriş Yap
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/signup" variant="body2">
                                        Hesabınız yok mu? Kayıt olun
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Paper>
            </Grid>
        </ThemeProvider>
    );
}

export default Login;
