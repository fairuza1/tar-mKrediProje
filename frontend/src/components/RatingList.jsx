import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Snackbar,
    Alert,
    CircularProgress,
    Box
} from '@mui/material';
import axios from 'axios';

const RatingList = () => {
    const [ratings, setRatings] = useState([]);
    const [harvests, setHarvests] = useState([]);
    const [sowings, setSowings] = useState([]);
    const [lands, setLands] = useState([]);
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const userId = parseInt(localStorage.getItem('userId')); // Kullanıcı ID'sini al

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [ratingsResponse, harvestsResponse, sowingsResponse, landsResponse, plantsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/api/ratings', { withCredentials: true }),
                    axios.get('http://localhost:8080/harvests', { withCredentials: true }),
                    axios.get('http://localhost:8080/sowings', { withCredentials: true }),
                    axios.get('http://localhost:8080/lands', { withCredentials: true }),
                    axios.get('http://localhost:8080/plants', { withCredentials: true })
                ]);

                setRatings(ratingsResponse.data);
                setHarvests(harvestsResponse.data);
                setSowings(sowingsResponse.data);
                setLands(landsResponse.data);
                setPlants(plantsResponse.data);
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

    // Belirli kullanıcıya ait verileri filtreleyin
    const filteredRatings = ratings.filter(rating => {
        const harvest = harvests.find(h => h.id === rating.harvestId);
        const sowing = harvest ? sowings.find(s => s.id === harvest.sowingId) : null;
        const land = sowing ? lands.find(l => l.id === sowing.landId) : null;
        return land && land.userId === userId; // Sadece kullanıcıya ait verileri döndür
    });

    const getSowing = (sowingId) => sowings.find(sowing => sowing.id === sowingId);
    const getLand = (landId) => lands.find(land => land.id === landId);
    const getPlantName = (plantId) => plants.find(plant => plant.id === plantId)?.name || 'Bilinmiyor';

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Değerlendirme Listesi
            </Typography>
            <Grid container spacing={3}>
                {filteredRatings.map((rating) => {
                    const harvest = harvests.find(h => h.id === rating.harvestId);
                    const sowing = harvest ? getSowing(harvest.sowingId) : null;
                    const land = sowing ? getLand(sowing.landId) : null;
                    const plantName = sowing ? getPlantName(sowing.plantId) : 'Bilinmiyor';

                    return (
                        <Grid item xs={12} sm={6} md={4} key={rating.harvestId}>
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.2)',
                                    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.3)',
                                        transform: 'translateY(-4px)',
                                    },
                                    padding: '16px',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={land?.imageUrl || "../../src/assets/DefaultImage/DefaultImage.jpg"}
                                    alt={land?.name || 'Unknown Land'}
                                    sx={{ borderRadius: "8px" }}
                                />
                                <CardHeader
                                    title={`Arazi Adı: ${land ? land.name : 'Bilinmiyor'}`}
                                    subheader={`Arazi Türü: ${land ? land.landType : 'Bilinmiyor'}`}
                                />

                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        Bitki Adı: {plantName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ekilen Alan: {sowing ? sowing.amount : 'Bilinmiyor'} m²
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Hasat Koşulları: {rating.harvestCondition}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ürün Kalitesi: {rating.productQuality}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ürün Miktarı: {rating.productQuantity} kg
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Genel Değerlendirme: {rating.overallRating}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RatingList;
