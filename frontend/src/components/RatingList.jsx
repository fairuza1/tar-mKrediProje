import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert
} from '@mui/material';
import axios from 'axios';

const RatingList = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/ratings', { withCredentials: true });
                setRatings(response.data);
            } catch (error) {
                console.error('Hata oluştu:', error);
                setSnackbarMessage('Değerlendirmeler alınırken bir hata oluştu.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Değerlendirme Listesi
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Hasat ID</TableCell>
                            <TableCell>Hasat Koşulları</TableCell>
                            <TableCell>Ürün Kalitesi</TableCell>
                            <TableCell>Ürün Miktarı (kg)</TableCell>
                            <TableCell>Genel Değerlendirme</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ratings.map((rating) => (
                            <TableRow key={rating.harvestId}>
                                <TableCell>{rating.harvestId}</TableCell>
                                <TableCell>{rating.harvestCondition}</TableCell>
                                <TableCell>{rating.productQuality}</TableCell>
                                <TableCell>{rating.productQuantity}</TableCell>
                                <TableCell>{rating.overallRating}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RatingList;
