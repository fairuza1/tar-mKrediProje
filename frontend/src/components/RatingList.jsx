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
    const [harvests, setHarvests] = useState([]);
    const [sowings, setSowings] = useState([]);
    const [lands, setLands] = useState([]);
    const [plants, setPlants] = useState([]); // Bitki bilgilerini tutacak state
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [ratingsResponse, harvestsResponse, sowingsResponse, landsResponse, plantsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/api/ratings', { withCredentials: true }),
                    axios.get('http://localhost:8080/harvests', { withCredentials: true }),
                    axios.get('http://localhost:8080/sowings', { withCredentials: true }),
                    axios.get('http://localhost:8080/lands', { withCredentials: true }),
                    axios.get('http://localhost:8080/plants', { withCredentials: true }) // Bitki bilgilerini çekiyoruz
                ]);

                setRatings(ratingsResponse.data);
                setHarvests(harvestsResponse.data);
                setSowings(sowingsResponse.data);
                setLands(landsResponse.data);
                setPlants(plantsResponse.data); // Bitki bilgilerini state'e atıyoruz
            } catch (error) {
                console.error('Hata oluştu:', error);
                setSnackbarMessage('Veriler alınırken bir hata oluştu.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const getSowing = (sowingId) => sowings.find(sowing => sowing.id === sowingId);
    const getLand = (landId) => lands.find(land => land.id === landId);
    const getPlantName = (plantId) => plants.find(plant => plant.id === plantId)?.name || 'Bilinmiyor'; // Bitki adını alıyoruz

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
                            <TableCell>Arazi Adı</TableCell>
                            <TableCell>Bitki Adı</TableCell>
                            <TableCell>Ekilen Alan (m²)</TableCell>
                            <TableCell>Hasat Koşulları</TableCell>
                            <TableCell>Ürün Kalitesi</TableCell>
                            <TableCell>Ürün Miktarı (kg)</TableCell>
                            <TableCell>Genel Değerlendirme</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ratings.map((rating) => {
                            const harvest = harvests.find(h => h.id === rating.harvestId);
                            const sowing = harvest ? getSowing(harvest.sowingId) : null;
                            const land = sowing ? getLand(sowing.landId) : null;
                            const plantName = sowing ? getPlantName(sowing.plantId) : 'Bilinmiyor'; // Bitki adı

                            return (
                                <TableRow key={rating.harvestId}>
                                    <TableCell>{rating.harvestId}</TableCell>
                                    <TableCell>{land ? land.name : 'Bilinmiyor'}</TableCell>
                                    <TableCell>{plantName}</TableCell> {/* Bitki adını gösteriyoruz */}
                                    <TableCell>{sowing ? sowing.amount : 'Bilinmiyor'} m²</TableCell>
                                    <TableCell>{rating.harvestCondition}</TableCell>
                                    <TableCell>{rating.productQuality}</TableCell>
                                    <TableCell>{rating.productQuantity}</TableCell>
                                    <TableCell>{rating.overallRating}</TableCell>
                                </TableRow>
                            );
                        })}
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
