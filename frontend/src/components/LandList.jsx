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
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import { styled } from '@mui/system';

const LandList = () => {
    const [lands, setLands] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [landToDelete, setLandToDelete] = useState(null);
    const [accordionOpen, setAccordionOpen] = useState(false);

    const [filterCity, setFilterCity] = useState('');
    const [filterDistrict, setFilterDistrict] = useState('');
    const [filterName, setFilterName] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/lands', { withCredentials: true })
            .then(response => {
                setLands(response.data);
            })
            .catch(error => {
                console.error('Error fetching lands:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                }
            });
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

    const handleDetail = (id) => {
        navigate(`/lands/detail/${id}`, { state: { editMode: true } }); // Yönlendirme yaparken editMode bilgisi gönderiyoruz
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/lands/delete/${landToDelete}`, { withCredentials: true });
            setLands(lands.filter(land => land.id !== landToDelete));
            setSnackbarMessage('Arazi başarıyla silindi!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting land:', error);
            setSnackbarMessage('Arazi silinemedi.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleOpenDeleteDialog = (id) => {
        setLandToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleAccordionChange = (event, isExpanded) => {
        setAccordionOpen(isExpanded);
    };

    const filteredLands = lands.filter(land => {
        const matchesCity = filterCity ? land.city.toLowerCase().includes(filterCity.toLowerCase()) : true;
        const matchesDistrict = filterDistrict ? land.district.toLowerCase().includes(filterDistrict.toLowerCase()) : true;
        const matchesName = filterName ? land.name === filterName : true;
        return matchesCity && matchesDistrict && matchesName;
    });

    const StyledCard = styled(Card)({
        maxWidth: 345,
        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.2)',
        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
        borderRadius: '12px',
        transition: 'transform 1.2s ease-in-out, box-shadow 0.4s ease-in-out',
        '&:hover': {
            boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.3)',
            transform: 'rotateY(360deg) scale(1.3)',
            position: 'relative',
            zIndex: 1000,
        },
    });

    return (
        <Container maxWidth="lg" sx={{ marginBottom: "60px" }}>
            <Box>
                <BreadcrumbComponent pageName="Arazilerim" />
            </Box>

            <Accordion
                expanded={accordionOpen}
                onChange={handleAccordionChange}
                sx={{
                    mt: 3,
                    mb: 3,
                    boxShadow: accordionOpen ? 'none' : '8px 8px 16px rgba(0, 0, 0, 0.2)',
                    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                    borderRadius: '26px',
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
                                label="İl"
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="İlçe"
                                value={filterDistrict}
                                onChange={(e) => setFilterDistrict(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Arazi Adı"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
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
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom marginLeft={2}>
                    Araziler Listesi
                </Typography>
                <Grid container spacing={3}>
                    {filteredLands.map((land) => (
                        <Grid item xs={12} sm={6} md={4} key={land.id}>
                            <StyledCard>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={land.imageUrl || "../../src/assets/DefaultImage/DefaultImage.jpg"}
                                    alt={land.name}
                                    sx={{ borderRadius: "8px" }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {land.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Boyut: <span style={{ marginLeft: '23px' }}>{land.landSize} hektar</span>
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Şehir: <span style={{ marginLeft: '25px' }}> {land.city}</span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        İlçe: <span style={{ marginLeft: '38px' }}> {land.district}</span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Köy:   <span style={{ marginLeft: '35px' }}>{land.village || 'Köy yok'}</span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Arazi Tipi: <span style={{ marginLeft: '0px' }}>{land.landType || 'N/A'}</span>
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                                    <Button variant="contained" color="success" onClick={() => handleDetail(land.id)}>
                                        Güncelleme
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleOpenDeleteDialog(land.id)}>
                                        Sil
                                    </Button>
                                </Box>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Silmek istediğinizden emin misiniz?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Bu işlem geri alınamaz. Silmek istediğinizden emin misiniz?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        İptal
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>
            <ScrollToTop />
        </Container>
    );
};

export default LandList;
