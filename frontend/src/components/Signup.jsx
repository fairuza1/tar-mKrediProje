import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Paper, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import backgroundImage from 'C:/Users/ercan kara/IdeaProjects/TarimKrediProjem/frontend/public/images/farm-background.jpg';
import logoImage from 'C:/Users/ercan kara/IdeaProjects/TarimKrediProjem/frontend/public/images/leftphoto.jpg';

const theme = createTheme();

function Signup() {
    const [username, setUsername] = useState(''); // 'user' yerine 'username'
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true); // E-mail doğrulaması için
    const navigate = useNavigate();

    const validateForm = () => {
        if (!username) {
            setError('Lütfen kullanıcı adını giriniz.');
            return false;
        }
        if (!password) {
            setError('Lütfen şifrenizi giriniz.');
            return false;
        }
        if (!email) {
            setError('Lütfen e-posta adresinizi giriniz.');
            return false;
        }
        if (!isEmailValid) {
            setError('Lütfen geçerli bir e-posta adresi giriniz.');
            return false;
        }
        if (!isPasswordValid) {
            setError('Lütfen geçerli bir şifre giriniz.');
            return false;
        }
        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/auth/signup', { username, password, email, phoneNumber });
            if (response.status === 200) {
                setMessage('Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz...');
                setError('');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/login');
                }, 2000);
            } else if (response.data && response.data.message === 'User already exists') {
                setError('Bu kullanıcı adı zaten mevcut.');
                setLoading(false);
            } else {
                setError('Bir hata oluştu. Lütfen tekrar deneyin.');
                setLoading(false);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'kullanıcı adı veya mail zaten mevcut');
            } else {
                setError(' kullanıcı adı veya mail zaten mevcut.');
            }
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!regex.test(passwordValue)) {
            setError("Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.");
            setIsPasswordValid(false);
        } else {
            setError('');
            setIsPasswordValid(true);
        }
    };

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basit e-posta doğrulama regex'i
        if (!emailRegex.test(emailValue)) {
            setError('Geçersiz e-posta adresi.');
            setIsEmailValid(false);
        } else {
            setError('');
            setIsEmailValid(true);
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
                        width: '100%',
                        maxWidth: '950px',
                        borderRadius: '12px',
                        borderTopLeftRadius: '100px',
                        borderBottomRightRadius: '100px',
                        overflow: 'hidden',
                    }}
                >
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
                            Kayıt Ol
                        </Typography>
                        {loading && (
                            <CircularProgress size={24} sx={{ mt: 2, mb: 2 }} />
                        )}
                        <Box component="form" noValidate onSubmit={handleSignup} sx={{ mt: 1 }}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Kullanıcı Adı gir"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Şifre"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={loading}
                            />
                            <TextField
                                // variant="outlined"
                                margin="normal"
                                required //yıldız işareti verir
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={loading}
                            />

                            {error && (
                                <Typography variant="body2" color="error" align="center" >
                                    {error}
                                </Typography>
                            )}
                            {message && (
                                <Typography variant="body2" color="success" align="center">
                                    {message}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, bgcolor: '#6c757d' }}
                                disabled={loading}
                            >
                                Kayıt Ol
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        Zaten bir hesabınız var mı? Giriş yapın
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

export default Signup;
