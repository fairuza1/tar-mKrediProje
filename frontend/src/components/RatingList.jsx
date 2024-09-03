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
    Box,
    TextField,
    MenuItem,
    Slider,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

    // Filtreleme durumları
    const [filterLand, setFilterLand] = useState('');
    const [filterPlant, setFilterPlant] = useState('');
    const [filterRating, setFilterRating] = useState([0, 5]);

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

    // Kullanıcının ekmiş olduğu bitkileri filtreleyin ve tekrarlananları kaldırın
    const userSownPlants = Array.from(
        new Set( // Set yapısı kullanılarak tekrar eden bitki adları kaldırılır
            sowings
                .filter(sowing => lands.find(land => land.id === sowing.landId)?.userId === userId)
                .map(sowing => plants.find(plant => plant.id === sowing.plantId)?.name)
                .filter(Boolean) // Undefined olanları filtrele
        )
    ).map(plantName => plants.find(plant => plant.name === plantName));

    // Seçilen araziye ait bitkileri filtrele
    const filteredPlants = filterLand
        ? Array.from(
            new Set(
                sowings
                    .filter(sowing => {
                        const land = lands.find(land => land.id === sowing.landId);
                        return land && land.name === filterLand && land.userId === userId;
                    })
                    .map(sowing => plants.find(plant => plant.id === sowing.plantId)?.name)
                    .filter(Boolean)
            )
        ).map(plantName => plants.find(plant => plant.name === plantName))
        : userSownPlants;

    // Filtrelenmiş değerlendirme listesi
    const filteredRatings = ratings.filter(rating => {
        const harvest = harvests.find(h => h.id === rating.harvestId);
        const sowing = harvest ? sowings.find(s => s.id === harvest.sowingId) : null;
        const land = sowing ? lands.find(l => l.id === sowing.landId) : null;
        const plant = sowing ? plants.find(p => p.id === sowing.plantId) : null;
        const matchesLand = filterLand ? (land && land.name === filterLand) : true;
        const matchesPlant = filterPlant ? (plant && plant.name === filterPlant) : true;
        const matchesRating = rating.overallRating >= filterRating[0] && rating.overallRating <= filterRating[1];

        return land && land.userId === userId && matchesLand && matchesPlant && matchesRating;
    });

    const getSowing = (sowingId) => sowings.find(sowing => sowing.id === sowingId);
    const getLand = (landId) => lands.find(land => land.id === landId);
    const getPlantName = (plantId) => plants.find(plant => plant.id === plantId)?.name || 'Bilinmiyor';

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleRatingChange = (event, newValue) => {
        setFilterRating(newValue);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Değerlendirme Listesi
            </Typography>

            {/* Filtreleme bölümü */}
            <Accordion sx={{ mt: 3, mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Filtreleme Seçenekleri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Arazi Adı"
                                value={filterLand}
                                onChange={(e) => setFilterLand(e.target.value)}
                                select
                                fullWidth
                            >
                                <MenuItem value="">Hepsi</MenuItem>
                                {lands.map((land) => (
                                    <MenuItem key={land.id} value={land.name}>
                                        {land.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Bitki Adı"
                                value={filterPlant}
                                onChange={(e) => setFilterPlant(e.target.value)}
                                select
                                fullWidth
                            >
                                <MenuItem value="">Hepsi</MenuItem>
                                {filteredPlants.map((plant) => (
                                    <MenuItem key={plant.id} value={plant.name}>
                                        {plant.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1" gutterBottom>
                                Genel Değerlendirme
                            </Typography>
                            <Slider
                                value={filterRating}
                                onChange={handleRatingChange}
                                valueLabelDisplay="auto"
                                step={0.1}
                                min={0}
                                max={5}
                                marks={[
                                    { value: 0, label: '0' },
                                    { value: 5, label: '5' },
                                ]}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

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
