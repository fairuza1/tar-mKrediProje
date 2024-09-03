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
    TextField,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Slider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const SowingList = () => {
    const [sowings, setSowings] = useState([]);
    const [lands, setLands] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [harvestedSowings, setHarvestedSowings] = useState(JSON.parse(localStorage.getItem('harvestedSowings')) || []);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [accordionOpen, setAccordionOpen] = useState(false); // Accordion durumunu takip eder

    // Filtreleme durumları
    const [filterLand, setFilterLand] = useState('');
    const [filterPlant, setFilterPlant] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterHarvested, setFilterHarvested] = useState('');
    const [filterAreaRange, setFilterAreaRange] = useState([0, 10000]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sowingResponse = await axios.get('http://localhost:8080/sowings', { withCredentials: true });
                setSowings(sowingResponse.data);
            } catch (error) {
                console.error('Error fetching sowings:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                } else {
                    setError('Ekim verileri alınırken bir hata oluştu.');
                    setSnackbarSeverity('error');
                    setSnackbarMessage('Ekim verileri alınırken bir hata oluştu.');
                    setSnackbarOpen(true);
                }
            }

            try {
                const landResponse = await axios.get('http://localhost:8080/lands', { withCredentials: true });
                setLands(landResponse.data);
            } catch (error) {
                console.error('Error fetching lands:', error);
                setError('Arazi verileri alınırken bir hata oluştu.');
                setSnackbarSeverity('error');
                setSnackbarMessage('Arazi verileri alınırken bir hata oluştu.');
                setSnackbarOpen(true);
            }
        };

        fetchData();
    }, []);

    if (!isAuthenticated) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" color="error">
                        Oturum açmadan görüntüleyemezsiniz.
                    </Typography>
                </Box>
            </Container>
        );
    }

    const getLand = (landId) => {
        return lands.find(land => land.id === landId);
    };

    const getRemainingSize = (landId) => {
        const land = getLand(landId);
        if (!land) return 0;

        const landSize = land.landSize;
        const totalSownAmount = sowings
            .filter(sowing => sowing.landId === landId)
            .reduce((sum, sowing) => sum + sowing.amount, 0);

        return landSize - totalSownAmount;
    };

    const handleDetail = (id) => {
        navigate(`/sowings/detail/${id}`);
    };

    const handleHarvest = async (sowingId) => {
        const sowing = sowings.find(s => s.id === sowingId);
        if (!sowing) {
            console.error('Ekim bulunamadı:', sowingId);
            return;
        }

        const harvestData = {
            harvestDate: new Date(),
            sowingId: sowing.id,
        };

        try {
            const response = await axios.post('http://localhost:8080/harvests', harvestData, { withCredentials: true });
            const harvestedId = response.data.id;

            const updatedHarvestedSowings = [...harvestedSowings, sowingId];
            setHarvestedSowings(updatedHarvestedSowings);
            localStorage.setItem('harvestedSowings', JSON.stringify(updatedHarvestedSowings));
            setSnackbarSeverity('success');
            setSnackbarMessage('Hasat başarıyla kaydedildi!');
            setSnackbarOpen(true);

            setTimeout(() => {
                navigate(`/rating/${harvestedId}`, { state: { harvestId: harvestedId } });
            }, 3000);

        } catch (error) {
            console.error('Hasat kaydetme hatası:', error);
            setError('Hasat kaydedilirken bir hata oluştu.');
            setSnackbarSeverity('error');
            setSnackbarMessage('Hasat kaydedilirken bir hata oluştu.');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleAreaChange = (event, newValue) => {
        setFilterAreaRange(newValue);
    };

    // Accordion açık/kapalı durumu değiştiğinde stil değiştir
    const handleAccordionChange = (event, isExpanded) => {
        setAccordionOpen(isExpanded);
    };

    // Seçilen araziye göre bitkileri filtrele
    const filteredPlants = filterLand
        ? Array.from(
            new Set(
                sowings
                    .filter(sowing => {
                        const land = lands.find(land => land.id === sowing.landId);
                        return land && land.name === filterLand;
                    })
                    .map(sowing => sowing.plantName)
            )
        )
        : Array.from(
            new Set(
                sowings.map(sowing => sowing.plantName)
            )
        );

    // Filtrelenmiş ekim listesi
    const filteredSowings = sowings.filter(sowing => {
        const land = getLand(sowing.landId);
        const matchesLand = filterLand ? (land && land.name === filterLand) : true;
        const matchesPlant = filterPlant ? sowing.plantName.toLowerCase().includes(filterPlant.toLowerCase()) : true;
        const matchesDate = filterDate ? new Date(sowing.sowingDate).toLocaleDateString('en-CA') === filterDate : true;
        const matchesHarvested = filterHarvested === 'harvested' ? harvestedSowings.includes(sowing.id) :
            filterHarvested === 'notHarvested' ? !harvestedSowings.includes(sowing.id) : true;
        const matchesArea = sowing.amount >= filterAreaRange[0] && sowing.amount <= filterAreaRange[1];
        return matchesLand && matchesPlant && matchesDate && matchesHarvested && matchesArea;
    });

    return (
        <Container maxWidth="lg">
            <Box>
                <BreadcrumbComponent pageName="Ekimlerim" />
            </Box>

            {/* Filtreleme bölümü */}
            <Accordion
                expanded={accordionOpen}
                onChange={handleAccordionChange}
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
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Filtreleme Seçenekleri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Arazi Seç"
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
                                {filteredPlants.map((plantName, index) => (
                                    <MenuItem key={index} value={plantName}>
                                        {plantName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Ekim Tarihi"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Hasat Durumu"
                                value={filterHarvested}
                                onChange={(e) => setFilterHarvested(e.target.value)}
                                select
                                fullWidth
                            >
                                <MenuItem value="">Hepsi</MenuItem>
                                <MenuItem value="harvested">Hasat Edildi</MenuItem>
                                <MenuItem value="notHarvested">Hasat Edilmedi</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1" gutterBottom>
                                Ekili Alan Aralığı (m²)
                            </Typography>
                            <Slider
                                value={filterAreaRange}
                                onChange={handleAreaChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={10000}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Ekimlerim Listesi
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Grid container spacing={3}>
                    {filteredSowings.map((sowing) => {
                        const land = getLand(sowing.landId);
                        const remainingSize = getRemainingSize(sowing.landId);
                        const isHarvested = harvestedSowings.includes(sowing.id);
                        return (
                            <Grid item xs={12} sm={6} md={4} key={sowing.id}>
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
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {land ? land.name : 'Bilinmiyor'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Arazi Tipi: {land ? land.landType : 'Bilinmiyor'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Bitki: {sowing.plantName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Arazi Alanı: {land ? land.landSize : 'Bilinmiyor'} m²
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ekilen Alan: {sowing.amount} m²
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Boş Alan: {remainingSize < 0 ? 0 : remainingSize} m²
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ekim Tarihi: {new Date(sowing.sowingDate).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                        <Button variant="contained" color="primary" onClick={() => handleDetail(sowing.id)}>
                                            Güncelleme
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleHarvest(sowing.id)}
                                            sx={{ ml: 1 }}
                                            disabled={isHarvested}
                                        >
                                            {isHarvested ? 'Hasat Edildi' : 'Hasat Et'}
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* Snackbar ile bildirim */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SowingList;
