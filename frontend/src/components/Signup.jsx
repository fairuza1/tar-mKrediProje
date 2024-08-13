import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

function Signup() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/signup', { user, password });
            if (response.data.message === 'Signup successful') {
                setMessage('Signup successful. Redirecting to login page...');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleSignup} sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Signup
                </Typography>
                <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* Additional input fields for future use */}
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    margin="normal"
                />
                {error && <Alert severity="error">{error}</Alert>}
                {message && <Alert severity="success">{message}</Alert>}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Signup
                </Button>
            </Box>
        </Container>
    );
}

export default Signup;
