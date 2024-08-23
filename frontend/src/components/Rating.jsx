import * as React from 'react';
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
import { useNavigate } from 'react-router-dom';
import axios from "axios";

// Icon büyütme stili
const StyledIcon = styled('div')(({ selected }) => ({
    cursor: 'pointer',
    transition: 'transform 0.2s',
    transform: selected ? 'scale(2)' : 'scale(1)', // Seçildiğinde 2 katı büyüt
    '&:hover': {
        transform: 'scale(3)',
    },
}));

const RatingComponent = () => {
    const navigate = useNavigate();
    const [harvestId, setHarvestId] = React.useState(null);
    const [harvestCondition, setHarvestCondition] = React.useState(0);
    const [productQuality, setProductQuality] = React.useState(0);
    const [overallRating, setOverallRating] = React.useState(0);
    const [productQuantity, setProductQuantity] = React.useState('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!harvestId || !productQuantity || harvestCondition === 0 || productQuality === 0) {
            setSnackbarMessage('Lütfen tüm alanları doldurun.');
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
            const response = await axios.post('http://localhost:8080/rating', newEvaluation, { withCredentials: true });

            if (response.status === 200) {
                setSnackbarMessage('Değerlendirme başarıyla yapıldı.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => navigate('/'), 3000);
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
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>1</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>2</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>3</TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>4</TableCell>
                                <TableCell align="center">5</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Hasat Koşulları
                                </TableCell>
                                <TableCell colSpan={5} align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
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
                                <TableCell colSpan={5} align="center">
                                    <TextField
                                        label="Ürün Miktarı"
                                        value={productQuantity}
                                        onChange={(e) => setProductQuantity(e.target.value)}
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                        }}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ borderRight: '1px solid #ddd' }}>
                                    Genel Değerlendirme
                                </TableCell>
                                <TableCell colSpan={5} align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <StyledIcon>
                                            <SentimentVeryDissatisfiedIcon style={{ color: '#FF1744' }} />
                                        </StyledIcon>
                                        <StyledIcon>
                                            <SentimentDissatisfiedIcon style={{ color: '#FF9100' }} />
                                        </StyledIcon>
                                        <StyledIcon>
                                            <SentimentSatisfiedIcon style={{ color: '#FFD600' }} />
                                        </StyledIcon>
                                        <StyledIcon>
                                            <SentimentSatisfiedAltIcon style={{ color: '#76FF03' }} />
                                        </StyledIcon>
                                        <StyledIcon>
                                            <SentimentVerySatisfiedIcon style={{ color: '#00E676' }} />
                                        </StyledIcon>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={handleSubmit}>
                        Değerlendirmeyi Gönder
                    </Button>
                </Box>

                <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

RatingComponent.propTypes = {
    harvestId: PropTypes.string.isRequired,
};

export default RatingComponent;
