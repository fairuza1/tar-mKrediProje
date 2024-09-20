import React, {useState, useEffect, useRef} from 'react';
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
    Slider,
    Pagination
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import ScrollToTop from './ScrollToTop';

const SowingList = () => {
    const [sowings, setSowings] = useState([]);
    const [lands, setLands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [harvestedSowings, setHarvestedSowings] = useState(JSON.parse(localStorage.getItem('harvestedSowings')) || []);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [accordionOpen, setAccordionOpen] = useState(false);

    const [filterLand, setFilterLand] = useState('');
    const [filterPlant, setFilterPlant] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterHarvested, setFilterHarvested] = useState('');
    const [filterAreaRange, setFilterAreaRange] = useState([0, 10000]);

    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(6); // Kart başına gösterilecek öğe sayısı

    const navigate = useNavigate();
    const topRef = useRef(null); // Ref tanımlandı

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sowingResponse = await axios.get('http://localhost:8080/sowings', { withCredentials: true });
                setSowings(sowingResponse.data);
            } catch (error) {
                console.error('Ekim verileri alınırken bir hata oluştu:', error);
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
                console.error('Arazi verileri alınırken bir hata oluştu:', error);
                setSnackbarSeverity('error');
                setSnackbarMessage('Arazi verileri alınırken bir hata oluştu.');
                setSnackbarOpen(true);
            }

            try {
                const categoryResponse = await axios.get('http://localhost:8080/categories', { withCredentials: true });
                setCategories(categoryResponse.data);
            } catch (error) {
                console.error('Kategoriler alınırken bir hata oluştu:', error);
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

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.categoryName : 'Bilinmiyor';
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

    // Güncelle butonuna basıldığında sowing detail sayfasına yönlendirme
    const handleDetail = (id) => {
        // sowing detail sayfasına yönlendirme
        navigate(`/sowings/detail/${id}`, { state: { isEditing: true } });
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

    const handleAccordionChange = (event, isExpanded) => {
        setAccordionOpen(isExpanded);
    };

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

    // Sayfalamaya uygun verileri al
    const paginatedSowings = filteredSowings.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filteredSowings.length / itemsPerPage);

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

            <Box sx={{ mt: 3 }}>
                <BreadcrumbComponent pageName="Ekimlerim" />
            </Box>

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
                    {paginatedSowings.map((sowing) => {
                        const land = getLand(sowing.landId);
                        const remainingSize = getRemainingSize(sowing.landId);
                        const isHarvested = harvestedSowings.includes(sowing.id);
                        const categoryName = getCategoryName(sowing.categoryId);
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
                                            Arazi Tipi  <span style={{marginLeft: '15px'}}> :{land ? land.landType : 'Bilinmiyor'} </span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Kategori<span style={{marginLeft: '19px'}}> :{categoryName} </span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Bitki <span style={{marginLeft: '46px'}}>:{sowing.plantName}</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Arazi Alanı<span style={{marginLeft: '9px'}}>:{land ? land.landSize : 'Bilinmiyor'} m²</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ekilen Alan<span style={{marginLeft: '6px'}}>:{sowing.amount} m²</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Boş Alan<span style={{marginLeft: '20px'}}>:{remainingSize < 0 ? 0 : remainingSize} m²</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ekim Tarihi<span style={{marginLeft: '6px'}}>:{new Date(sowing.sowingDate).toLocaleDateString()}</span>
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleDetail(sowing.id)}
                                            disabled={isHarvested} // Eğer hasat edildiyse buton inaktif olacak
                                        >
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
                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange} // Sayfa değiştiğinde scroll işlemi yapacak
                        color="primary"
                    />
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <ScrollToTop />
        </Container>
    );
};

export default SowingList;

