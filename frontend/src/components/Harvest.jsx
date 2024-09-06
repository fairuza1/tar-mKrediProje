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
    CircularProgress,
    TextField,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Slider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import ScrollToTop from './ScrollToTop'; // ScrollToTop bileşeni buraya import edilecek

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
    const [accordionOpen, setAccordionOpen] = useState(false);

    // Filtreleme durumları
    const [filterLand, setFilterLand] = useState('');
    const [filterAreaRange, setFilterAreaRange] = useState([0, 10000]);

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
        const matchesLand = filterLand ? (land && land.name === filterLand) : true;
        const matchesArea = sowing ? sowing.amount >= filterAreaRange[0] && sowing.amount <= filterAreaRange[1] : true;
        return land && land.userId === userId && matchesLand && matchesArea; // Sadece kullanıcıya ait ve filtreye uyan verileri döndür
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

    const handleAreaChange = (event, newValue) => {
        setFilterAreaRange(newValue);
    };

    const handleAccordionChange = (event, isExpanded) => {
        setAccordionOpen(isExpanded);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 3 }}>
                <BreadcrumbComponent pageName="Hasatlar" />
            </Box>

            {/* Filtreleme bölümü */}
            <Accordion
                expanded={accordionOpen}
                onChange={handleAccordionChange}
                sx={{
                    mt: 3,
                    mb: 3,
                    boxShadow: accordionOpen ? 'none' : '8px 8px 16px rgba(0, 0, 0, 0.2)', // Gölgelendirme efekti
                    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)', // Gradient arka plan
                    borderRadius: '12px', // Köşeleri yuvarlat
                    '&:hover': {
                        boxShadow: accordionOpen ? 'none' : '12px 12px 24px rgba(0, 0, 0, 0.3)', // Hover efekti
                        transform: accordionOpen ? 'none' : 'translateY(-4px)', // Hover animasyonu
                    },
                    padding: accordionOpen ? '0' : '16px',
                }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Filtreleme Seçenekleri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" gutterBottom>
                                Ekili Alan Aralığı (m²)
                            </Typography>
                            <Slider
                                value={filterAreaRange}
                                onChange={handleAreaChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={10000}
                                marks={[
                                    { value: 0, label: '0 m²' },
                                    { value: 10000, label: '10000 m²' },
                                ]}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

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
                                            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.2)', // Gölgelendirme efekti
                                            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)', // Gradient arka plan
                                            borderRadius: '12px',
                                            '&:hover': {
                                                boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.3)', // Hover'da derin gölge
                                                transform: 'translateY(-4px)', // Hover animasyonu
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
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {land ? land.name : 'Bilinmiyor'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Arazi Tipi<span style={{marginLeft: '20px'}}> :{land ? land.landType : 'Bilinmiyor'}</span>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Bitki <span style={{marginLeft: '54px'}}>:{sowing ? sowing.plantName : 'Bilinmiyor'}</span>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Ekilen Alan<span style={{marginLeft: '8px'}}>   : {sowing ? sowing.amount : 'Bilinmiyor'} m²</span>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hasat Tarihi<span
                                                style={{marginLeft: '2px'}}> :{new Date(harvest.harvestDate).toLocaleDateString()}</span>
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
            <ScrollToTop/>
        </Container>
    );
};

export default Harvest;
