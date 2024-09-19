import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css, styled } from '@mui/material/styles';
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
    TextField,
    Tooltip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

const StyledIcon = styled('div')(({ selected }) => ({
    cursor: 'pointer',
    transition: 'transform 0.2s ease, z-index 0.2s ease',
    transform: selected ? 'scale(2)' : 'scale(1)',
    '&:hover': {
        transform: 'scale(3)',
        zIndex: 10,
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    position: 'relative',
    zIndex: selected ? 1 : 111,
}));

const TableCellCustom = styled(TableCell)(({ theme }) => ({
    padding: '1px',
    border: '1px solid #ddd',
}));

const Rating = () => {
    const navigate = useNavigate();
    const { harvestId } = useParams();

    const [harvestCondition, setHarvestCondition] = useState(0);
    const [productQuality, setProductQuality] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [productQuantity, setProductQuantity] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (harvestCondition > 0 && productQuality > 0) {
            const average = (harvestCondition + productQuality) / 2;
            setAverageRating(average);
        } else {
            setAverageRating(0);
        }
    }, [harvestCondition, productQuality]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!harvestId || !productQuantity || harvestCondition === 0 || productQuality === 0) {
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
            overallRating: (harvestCondition + productQuality) / 2
        };

        try {
            const response = await axios.post('http://localhost:8080/api/ratings', newEvaluation, { withCredentials: true });

            if (response.status === 201) {
                setSnackbarMessage('Değerlendirme başarıyla yapıldı.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setHarvestCondition(0);
                setProductQuality(0);
                setProductQuantity('');

                // Değerlendirme tamamlandığında yönlendirme yap
                const ratingRedirectUrl = await axios.get(`http://localhost:8080/api/ratings/redirect?harvestId=${harvestId}`);
                let url = ratingRedirectUrl.data;

                // Harici URL'yi ayıkla
                const baseUrl = 'http://localhost:5173/';
                if (url.startsWith(baseUrl)) {
                    url = url.slice(baseUrl.length); // Başlangıç kısmını kaldır
                }

                // URL'nin 'http' ile başladığını kontrol et ve yönlendir
                if (url.startsWith('http')) {
                    window.location.href = url;
                } else {
                    navigate('/rating-list'); // İç URL'ye yönlendir
                }

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

    const handleProductQuantityChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setProductQuantity(value);
        }
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: 6 }}>
                <Typography variant="h4" component="h3" gutterBottom>
                    Değerlendirme Formu
                </Typography>

                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ borderRight: '1px solid #ddd', fontSize: '1.2rem', padding: '20px' }}></TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd', fontSize: '1.2rem', padding: '20px' }}>Çok Kötü</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd', fontSize: '1.2rem', padding: '20px' }}>Kötü</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd', fontSize: '1.2rem', padding: '20px' }}>Ne İyi Ne Kötü</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd', fontSize: '1.2rem', padding: '20px' }}>İyi</TableCell>
                                <TableCell align="center" sx={{ fontSize: '1.2rem', padding: '20px' }}>Çok iyi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd', fontSize: '1.5rem', padding: '8px', paddingBottom: '16px' }}>
                                    Hasat Koşulları
                                </TableCell>
                                <TableCellCustom align="center">
                                    <Tooltip title="1 Puan" arrow>
                                        <StyledIcon selected={harvestCondition === 1} onClick={() => setHarvestCondition(1)}>
                                            <SentimentVeryDissatisfiedIcon style={{ color: '#FF1744', fontSize: '1.8rem' }} />
                                        </StyledIcon>
                                    </Tooltip>
                                </TableCellCustom>
                                <TableCellCustom align="center">
                                    <Tooltip title="2 Puan" arrow>
                                        <StyledIcon selected={harvestCondition === 2} onClick={() => setHarvestCondition(2)}>
                                            <SentimentDissatisfiedIcon style={{ color: '#FF9100', fontSize: '1.8rem' }} />
                                        </StyledIcon>
                                    </Tooltip>
                                </TableCellCustom>
                                <TableCellCustom align="center">
                                    <Tooltip title="3 Puan" arrow>
                                        <StyledIcon selected={harvestCondition === 3} onClick={() => setHarvestCondition(3)}>
                                            <SentimentSatisfiedIcon style={{ color: '#FFD600', fontSize: '1.8rem' }} />
                                        </StyledIcon>
                                    </Tooltip>
                                </TableCellCustom>
                                <TableCellCustom align="center">
                                    <Tooltip title="4 Puan" arrow>
                                        <StyledIcon selected={harvestCondition === 4} onClick={() => setHarvestCondition(4)}>
                                            <SentimentSatisfiedAltIcon style={{ color: '#76FF03', fontSize: '1.8rem' }} />
                                        </StyledIcon>
                                    </Tooltip>
                                </TableCellCustom>
                                <TableCellCustom align="center">
                                    <Tooltip title="5 Puan" arrow>
                                        <StyledIcon selected={harvestCondition === 5} onClick={() => setHarvestCondition(5)}>
                                            <SentimentVerySatisfiedIcon style={{ color: '#00E676', fontSize: '1.8rem' }} />
                                        </StyledIcon>
                                    </Tooltip>
                                </TableCellCustom>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd', fontSize: '1.5rem', padding: '8px', paddingTop: '16px' }}>
                                    Ürün Kalitesi
                                </TableCell>
                                <TableCellCustom align="center">
                                    <Tooltip title="1 Puan" arrow>
                                        <StyledIcon selected={productQuality === 1} onClick={() => setProductQuality(1)}>
                                            <SentimentVeryDissatisfiedIcon style={{ color: '#FF1744', fontSize: '1.8rem' }} />
                                        </StyledIcon>
                                    </Tooltip>
                                </TableCellCustom>
                                <TableCellCustom align="center">
                                    <Tooltip title="2 Puan" arrow>
                                        <StyledIcon selected={productQuality === 2} onClick={() => setProductQuality(2)}>
                                            <SentimentDissatisfiedIcon style={{ color: '#FF9100', fontSize: '1.8rem' }} />
                                        </StyledIcon>
                                    </Tooltip>
                                </TableCellCustom>
                                <TableCellCustom align="center">
                                    <Tooltip title="3 Puan" arrow>
                                        <StyledIcon selected={productQuality === 3} onClick={() => setProductQuality(3)}>
                                            <SentimentSatisfiedIcon style={{ color: '#FFD600', fontSize: '1.8rem' }} />
                                        </StyledIcon>
                                    </Tooltip>
                                </TableCellCustom>
                                <TableCellCustom align="center">
                                    <Tooltip title="4 Puan" arrow>
                                        <StyledIcon selected={productQuality === 4} onClick={() => setProductQuality(4)}>
                                            <SentimentSatisfiedAltIcon style={{ color: '#76FF03', fontSize: '1.8rem' }} />
                                        </StyledIcon>
                                    </Tooltip>
                                </TableCellCustom>
                                <TableCellCustom align="center">
                                    <Tooltip title="5 Puan" arrow>
                                        <StyledIcon selected={productQuality === 5} onClick={() => setProductQuality(5)}>
                                            <SentimentVerySatisfiedIcon style={{ color: '#00E676', fontSize: '1.8rem' }} />
                                        </StyledIcon>
                                    </Tooltip>
                                </TableCellCustom>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd', fontSize: '1.5rem', padding: '8px' }}>
                                    Genel Değerlendirme
                                </TableCell>
                                <TableCell colSpan={5} align="center" sx={{ padding: '8px' }}>
                                    <Typography variant="h5">
                                        Ortalama Puan: {averageRating.toFixed(2)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                        Ürün Miktarı
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={productQuantity}
                        onChange={handleProductQuantityChange}
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontWeight: 'bold' }} >kg</InputAdornment>,
                            sx: { fontSize: '1.5rem' },
                            inputProps: { style: { textAlign: 'right' } },  // Sağdan hizalama
                        }}
                        sx={{ fontSize: '1.5rem' }}
                    />
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" sx={{ fontSize: '1rem', padding: '0.75rem 1rem' }} onClick={handleSubmit}>
                        Gönder
                    </Button>
                </Box>
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} severity={snackbarSeverity} sx={{ width: '100%', fontSize: '1.2rem' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Rating;
