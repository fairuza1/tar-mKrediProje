import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const Harvest = ({ onSowingUpdate }) => {
    const [harvests, setHarvests] = useState([]);
    const [sowings, setSowings] = useState([]);
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [harvestedSowings, setHarvestedSowings] = useState(JSON.parse(localStorage.getItem('harvestedSowings')) || []);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const userId = parseInt(localStorage.getItem('userId')); // Kullanıcı ID'sini al

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [harvestResponse, sowingResponse, landResponse] = await Promise.all([
                    axios.get('http://localhost:8080/harvests', { withCredentials: true }),
                    axios.get('http://localhost:8080/sowings', { withCredentials: true }),
                    axios.get('http://localhost:8080/lands', { withCredentials: true })
                ]);

                setHarvests(harvestResponse.data);
                setSowings(sowingResponse.data);
                setLands(landResponse.data);
            } catch (error) {
                console.error('Veri çekme hatası:', error);
                setError('Veriler alınırken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const getLand = (landId) => lands.find(land => land.id === landId);
    const getSowing = (sowingId) => sowings.find(sowing => sowing.id === sowingId);

    // Belirli kullanıcıya ait hasatları filtreleyin
    const filteredHarvests = harvests.filter(harvest => {
        const sowing = getSowing(harvest.sowingId);
        const land = sowing ? getLand(sowing.landId) : null;
        return land && land.userId === userId; // Sadece kullanıcıya ait verileri döndür
    });

    const handleDelete = async (harvestId, sowingId) => {
        try {
            await axios.delete(`http://localhost:8080/harvests/${harvestId}`, { withCredentials: true });
            const updatedHarvests = harvests.filter(h => h.id !== harvestId);
            setHarvests(updatedHarvests);
            const updatedHarvestedSowings = harvestedSowings.filter(id => id !== sowingId);
            setHarvestedSowings(updatedHarvestedSowings);
            localStorage.setItem('harvestedSowings', JSON.stringify(updatedHarvestedSowings));

            if (onSowingUpdate && typeof onSowingUpdate === 'function') {
                onSowingUpdate(sowingId);
            }

            setSnackbarMessage('Hasat başarıyla silindi!');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error('Hasat silme hatası:', error);
            setSnackbarMessage('Hasat silinirken bir hata oluştu.');
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 3 }}>
                <BreadcrumbComponent pageName="Hasatlar" />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Hasat Listesi
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredHarvests.map((harvest) => {
                            const sowing = getSowing(harvest.sowingId);
                            const land = sowing ? getLand(sowing.landId) : null;

                            return (
                                <Grid item xs={12} sm={6} md={4} key={harvest.id}>
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
                                            sx={{borderRadius:"8px"}}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {land ? land.name : 'Bilinmiyor'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Arazi Tipi: {land ? land.landType : 'Bilinmiyor'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Bitki: {sowing ? sowing.plantName : 'Bilinmiyor'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Ekilen Alan: {sowing ? sowing.amount : 'Bilinmiyor'} m²
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hasat Tarihi: {new Date(harvest.harvestDate).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDelete(harvest.id, sowing.id)}
                                            >
                                                Sil
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Harvest;
