import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Paper, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import backgroundImage from 'C:/Users/ercan kara/IdeaProjects/TarimKrediProjem/frontend/public/images/farm-background.jpg'; // Arka plan resminin yolu
import logoImage from 'C:/Users/ercan kara/IdeaProjects/TarimKrediProjem/frontend/public/images/leftphoto.jpg'; // Sol tablo resminin yolu

const theme = createTheme();

function Signup() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Spinner için loading durumu
    const [isPasswordValid, setIsPasswordValid] = useState(false); // Şifrenin geçerliliği için durum
    const navigate = useNavigate();

    const validateForm = () => {
        if (!user) {
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
        if (!isPasswordValid) {
            setError('Lütfen geçerli bir şifre giriniz.');
            return false;
        }
        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Form geçerli değilse işlem yapılmaz
        }

        setLoading(true); // Kayıt işlemi başladığında loading'i true yap
        try {
            const response = await axios.post('http://localhost:8080/auth/signup', { user, password, email, phoneNumber });
            if (response.status === 200) { // Eğer durum kodu 200 ise başarılı kabul edelim
                setMessage('Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz...');
                setError(''); // Hata mesajını temizle
                setTimeout(() => {
                    setLoading(false); // Yönlendirme öncesinde loading'i false yap
                    navigate('/login');
                }, 2000);
            } else if (response.data && response.data.message === 'User already exists') {
                setError('Bu kullanıcı adı zaten mevcut.');
                setLoading(false); // Hata olduğunda loading'i false yap
            } else {
                setError('Bir hata oluştu. Lütfen tekrar deneyin.');
                setLoading(false); // Hata olduğunda loading'i false yap
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Bir hata oluştu');
            } else {
                setError('Bir hata oluştu');
            }
            setLoading(false); // Hata olduğunda loading'i false yap
        }
    };

    const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!regex.test(passwordValue)) {
            setError("Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.");
            setIsPasswordValid(false); // Geçerli değilse, buton devre dışı kalır
        } else {
            setError(''); // Hata mesajını temizle
            setIsPasswordValid(true); // Geçerliyse, buton aktif hale gelir
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
                        borderRadius: '12px',
                        borderTopLeftRadius: '100px',
                        borderBottomRightRadius: '100px',
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
                    {/* Sağ Tablo: Kayıt Formu */}
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
                        {/* Spinner */}
                        {loading && (
                            <CircularProgress size={24} sx={{ mt: 2, mb: 2 }} />
                        )}
                        <Box component="form" noValidate onSubmit={handleSignup} sx={{ mt: 1 }}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="user"
                                label="Kullanıcı Adı gir"
                                name="user"
                                autoComplete="user"
                                autoFocus
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                disabled={loading} // Kayıt yaparken alanları devre dışı bırak
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
                                onChange={handlePasswordChange} // Burada handlePasswordChange fonksiyonunu kullanacağız
                                disabled={loading} // Kayıt yaparken alanları devre dışı bırak
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading} // Kayıt yaparken alanları devre dışı bırak
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="phoneNumber"
                                label="Telefon Numarası"
                                name="phoneNumber"
                                autoComplete="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={loading} // Kayıt yaparken alanları devre dışı bırak
                            />
                            {error && (
                                <Typography variant="body2" color="error" align="center">
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
                                disabled={loading} // Yükleme devam ediyorsa buton devre dışı
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
