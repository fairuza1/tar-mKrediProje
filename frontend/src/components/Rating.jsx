import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import {
    Container,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
    Alert,
    Paper,
    InputAdornment,
    TextField
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

const StyledIcon = styled('div')(({ selected }) => ({
    cursor: 'pointer',
    transition: 'transform 0.2s',
    transform: selected ? 'scale(2)' : 'scale(1)',
    '&:hover': {
        transform: 'scale(3)',
    },
}));

const Rating = () => {
    const navigate = useNavigate();
    const { harvestId } = useParams();

    const [harvestCondition, setHarvestCondition] = useState(0);
    const [productQuality, setProductQuality] = useState(0);
    const [overallRating, setOverallRating] = useState(0);
    const [productQuantity, setProductQuantity] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Gerekli kontroller
        if (!harvestId || !productQuantity || harvestCondition === 0 || productQuality === 0 || overallRating === 0) {
            setSnackbarMessage('Lütfen tüm alanları doldurun.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        if (isNaN(productQuantity) || parseFloat(productQuantity) <= 0) {
            setSnackbarMessage('Lütfen geçerli bir ürün miktarı girin.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        const newEvaluation = {
            harvestId,
            harvestCondition,
            productQuality,
            productQuantity: parseFloat(productQuantity),
            overallRating: parseFloat(overallRating)
        };

        try {
            const response = await axios.post('http://localhost:8080/api/ratings', newEvaluation, { withCredentials: true });

            if (response.status === 201) {
                setSnackbarMessage('Değerlendirme başarıyla yapıldı.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                // Formu temizle
                setHarvestCondition(0);
                setProductQuality(0);
                setOverallRating(0);
                setProductQuantity('');
                setTimeout(() => navigate('/rating-list'), 3000);
            } else {
                setSnackbarMessage('Değerlendirme kaydedilemedi.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }

        } catch (error) {
            console.error('Hata oluştu:', error);
            setSnackbarMessage('Hata: ' + error.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Bu fonksiyonu ekledim, yalnızca sayı ve ondalık değerlere izin veriyor
    const handleProductQuantityChange = (e) => {
        const value = e.target.value;
        // Girişin yalnızca sayı ve ondalık değer olmasını kontrol ediyor
        if (/^\d*\.?\d*$/.test(value)) {
            setProductQuantity(value); // Eğer geçerliyse değeri günceller
        }
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Değerlendirme Formu
                </Typography>

                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ borderRight: '1px solid #ddd' }}></TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>Çok Kötü</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>Kötü</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>Ne İyi Ne Kötü</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>İyi</TableCell>
                                <TableCell align="center">Çok iyi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Hasat Koşulları
                                </TableCell>
                                <TableCell colSpan={5} align="center">
                                    <Box sx={{ display:'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <StyledIcon selected={harvestCondition === 1} onClick={() => setHarvestCondition(1)}>
                                            <SentimentVeryDissatisfiedIcon style={{ color: '#FF1744' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={harvestCondition === 2} onClick={() => setHarvestCondition(2)}>
                                            <SentimentDissatisfiedIcon style={{ color: '#FF9100' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={harvestCondition === 3} onClick={() => setHarvestCondition(3)}>
                                            <SentimentSatisfiedIcon style={{ color: '#FFD600' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={harvestCondition === 4} onClick={() => setHarvestCondition(4)}>
                                            <SentimentSatisfiedAltIcon style={{ color: '#76FF03' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={harvestCondition === 5} onClick={() => setHarvestCondition(5)}>
                                            <SentimentVerySatisfiedIcon style={{ color: '#00E676' }} />
                                        </StyledIcon>
                                    </Box>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Ürün Kalitesi
                                </TableCell>
                                <TableCell colSpan={5} align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <StyledIcon selected={productQuality === 1} onClick={() => setProductQuality(1)}>
                                            <SentimentVeryDissatisfiedIcon style={{ color: '#FF1744' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={productQuality === 2} onClick={() => setProductQuality(2)}>
                                            <SentimentDissatisfiedIcon style={{ color: '#FF9100' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={productQuality === 3} onClick={() => setProductQuality(3)}>
                                            <SentimentSatisfiedIcon style={{ color: '#FFD600' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={productQuality === 4} onClick={() => setProductQuality(4)}>
                                            <SentimentSatisfiedAltIcon style={{ color: '#76FF03' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={productQuality === 5} onClick={() => setProductQuality(5)}>
                                            <SentimentVerySatisfiedIcon style={{ color: '#00E676' }} />
                                        </StyledIcon>
                                    </Box>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Ürün Miktarı
                                </TableCell>
                                <TableCell colSpan={5}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={productQuantity}
                                        onChange={handleProductQuantityChange} // Burada, sadece sayı girişine izin vermek için handleProductQuantityChange fonksiyonunu ekledim
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Genel Değerlendirme
                                </TableCell>
                                <TableCell colSpan={5} align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <StyledIcon selected={overallRating === 1} onClick={() => setOverallRating(1)}>
                                            <SentimentVeryDissatisfiedIcon style={{ color: '#FF1744' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={overallRating === 2} onClick={() => setOverallRating(2)}>
                                            <SentimentDissatisfiedIcon style={{ color: '#FF9100' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={overallRating === 3} onClick={() => setOverallRating(3)}>
                                            <SentimentSatisfiedIcon style={{ color: '#FFD600' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={overallRating === 4} onClick={() => setOverallRating(4)}>
                                            <SentimentSatisfiedAltIcon style={{ color: '#76FF03' }} />
                                        </StyledIcon>
                                        <StyledIcon selected={overallRating === 5} onClick={() => setOverallRating(5)}>
                                            <SentimentVerySatisfiedIcon style={{ color: '#00E676' }} />
                                        </StyledIcon>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Gönder
                    </Button>
                </Box>
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Rating;
