import React, {useEffect, useRef, useState} from 'react';
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
    AccordionDetails,
    Pagination
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
    const [accordionOpen, setAccordionOpen] = useState(false);

    // Filtreleme durumları
    const [filterLand, setFilterLand] = useState('');
    const [filterPlant, setFilterPlant] = useState('');
    const [filterRating, setFilterRating] = useState([0, 5]);

    // Sayfalama durumları
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(0);

    const userId = parseInt(localStorage.getItem('userId')); // Kullanıcı ID'sini al
    const topRef = useRef(null); // Ref tanımlandı

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
        new Set(
            sowings
                .filter(sowing => lands.find(land => land.id === sowing.landId)?.userId === userId)
                .map(sowing => plants.find(plant => plant.id === sowing.plantId)?.name)
                .filter(Boolean)
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

    // Sayfalama işlemi
    const paginatedRatings = filteredRatings.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    useEffect(() => {
        setTotalPages(Math.ceil(filteredRatings.length / rowsPerPage));
    }, [filteredRatings, rowsPerPage]);

    const getSowing = (sowingId) => sowings.find(sowing => sowing.id === sowingId);
    const getLand = (landId) => lands.find(land => land.id === landId);
    const getPlantName = (plantId) => plants.find(plant => plant.id === plantId)?.name || 'Bilinmiyor';

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleRatingChange = (event, newValue) => {
        setFilterRating(newValue);
    };

    const handleAccordionChange = (event, isExpanded) => {
        setAccordionOpen(isExpanded);
    };

    // Sayfa değiştiğinde scroll'u sayfanın başına kaydırma
    const handlePageChange = (event, value) => {
        setPage(value);
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' }); // Sayfanın başına smooth bir şekilde kaydırma
        }
    };

    return (
        <Container maxWidth="lg">
            <div ref={topRef}></div> {/* Ref burada kullanıldı */}

            <Typography variant="h4" component="h1" gutterBottom>
                Değerlendirme Listesi
            </Typography>

            {/* Filtreleme bölümü */}
            <Accordion
                sx={{
                    mt: 3,
                    mb: 3,
                    boxShadow: accordionOpen ? 'none' : '8px 8px 16px rgba(0, 0, 0, 0.2)',
                    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                    borderRadius: '12px',
                    '&:hover': {
                        boxShadow: accordionOpen ? 'none' : '12px 12px 24px rgba(0, 0, 0, 0.3)',
                        transform: accordionOpen ? 'none' : 'translateY(-4px)',
                    },
                    padding: accordionOpen ? '0' : '16px',
                }}
                expanded={accordionOpen}
                onChange={handleAccordionChange}
            >
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

            {/* Listeleme bölümü */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {paginatedRatings.map((rating) => {
                        const harvest = harvests.find(h => h.id === rating.harvestId);
                        const sowing = harvest ? getSowing(harvest.sowingId) : null;
                        const land = sowing ? getLand(sowing.landId) : null;
                        const plantName = sowing ? getPlantName(sowing.plantId) : 'Bilinmiyor';

                        return (
                            <Grid item xs={12} sm={6} md={4} key={rating.harvestId}>
                                <Card
                                    sx={{
                                        maxWidth: 345,
                                        boxShadow: accordionOpen ? 'none' : '8px 8px 16px rgba(0, 0, 0, 0.2)',
                                        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                                        borderRadius: '12px',
                                        '&:hover': {
                                            boxShadow: accordionOpen ? 'none' : '12px 12px 24px rgba(0, 0, 0, 0.3)',
                                            transform: accordionOpen ? 'none' : 'translateY(-4px)',
                                        },
                                        padding: accordionOpen ? '0' : '16px',
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
                                        subheader={`Arazi Türü : ${land ? land.landType : 'Bilinmiyor'}`}
                                        sx={{marginBottom:'0px',paddingBottom:'10'}}
                                    />
                                    <CardContent
                                    sx={{marginTop:'0px',paddingTop:'0px'}}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            Bitki Adı <span style={{ marginLeft: '51px' }}>:{plantName}</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ekilen Alan <span style={{ marginLeft: '30px' }}>:{sowing ? sowing.amount : 'Bilinmiyor'} m²</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Hasat Koşulları<span style={{ marginLeft: '6px' }}>:{rating.harvestCondition}</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ürün Kalitesi<span style={{ marginLeft: '19px' }}>:{rating.productQuality}</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ürün Miktarı<span style={{ marginLeft: '22px' }}>:{rating.productQuantity} kg</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Değerlendirme<span style={{ marginLeft: '5px' }}>:{rating.overallRating}</span>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Sayfalama bileşeni */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RatingList;
