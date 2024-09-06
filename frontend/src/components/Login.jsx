import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import backgroundImage
    from 'C:/Users/ercan kara/IdeaProjects/TarimKrediProjem/frontend/public/images/farm-background.jpg';
import logoImage from 'C:/Users/ercan kara/IdeaProjects/TarimKrediProjem/frontend/public/images/leftphoto.jpg';

const theme = createTheme();

function Login({setIsLoggedIn}) {
    const [username, setUsername] = useState(''); // 'user' yerine 'username'
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username) {
            setError('Kullanıcı adı veya e-posta boş bırakılamaz.');
            return;
        }

        if (!password) {
            setError('Lütfen şifrenizi giriniz.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                username,
                password
            }, {withCredentials: true});
            if (response.status === 200) {
                const data = response.data;
                // Hem userId'yi hem de username'i localStorage'a kaydediyoruz
                localStorage.setItem('userId', data.userId); // userId'yi sakla
                localStorage.setItem('username', data.username); // username'i sakla

                setIsLoggedIn(true);
                setTimeout(() => {
                    setLoading(false);
                    navigate('/home');
                }, 2000);
            } else {
                setError('Kullanıcı adı veya şifre hatalı.');
                setLoading(false);
            }
        } catch (error) {
            setError('Kullanıcı Adı veya Şifre yanlış.');
            console.error('Error:', error);
            setLoading(false);
        }
    };


    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setError(''); // Hata mesajını temizle
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(''); // Hata mesajını temizle
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
                <CssBaseline/>
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
                        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Giriş </Typography>
                        {loading && (
                            <CircularProgress size={24} sx={{mt: 2, mb: 2}}/>
                        )}
                        <Box component="form" noValidate onSubmit={handleLogin} sx={{mt: 1}}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Kullanıcı Adınızı veya E-postanızı Giriniz"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={handleUsernameChange} // Her değişiklikte hata mesajını temizle
                                disabled={loading}
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
                                onChange={handlePasswordChange} // Her değişiklikte hata mesajını temizle
                                disabled={loading}
                            />
                            {error && (
                                <Typography variant="body2" color="error" align="center">
                                    {error}
                                </Typography>
                            )}
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <TextField
                                    id="rememberMe"
                                    type="checkbox"
                                    sx={{marginLeft: '8px', marginRight: '8px'}}
                                    disabled={loading}
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
                                sx={{mt: 3, mb: 2, bgcolor: '#6c757d'}}
                                disabled={loading}
                            >
                                Giriş Yap
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{mt: 1, mb: 2, bgcolor: '#dc3545'}}
                                disabled={loading}
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
