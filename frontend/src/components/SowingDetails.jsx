import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Paper, Button, TextField, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const SowingDetails = () => {
    const { id } = useParams();
    const location = useLocation(); // state'den isEditing'i almak için kullanıyoruz
    const [sowing, setSowing] = useState(null);
    const [categories, setCategories] = useState([]);
    const [plants, setPlants] = useState([]);
    const [lands, setLands] = useState([]);
    const [sowings, setSowings] = useState([]);
    const [isEditing, setIsEditing] = useState(location.state?.isEditing || false); // Yönlendirme ile gelen isEditing durumunu kontrol ediyoruz
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [remainingSize, setRemainingSize] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const navigate = useNavigate();
    const formRef = useRef(null);  // Formu referans almak için useRef kullanıyoruz

    useEffect(() => {
        const fetchSowingDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/sowings/detail/${id}`, { withCredentials: true });
                setSowing(response.data);
                setSelectedCategory(response.data.categoryId);
                await fetchLands();
                await fetchSowings();
                fetchCategoriesAndPlants(response.data.categoryId);
                calculateRemainingSize();
            } catch (error) {
                console.error('Ekim detayları alınırken hata oluştu:', error);
            }
        };

        fetchSowingDetails();

        // Sayfa yüklendiğinde formun olduğu kısma kaydırma
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [id, lands.length, sowings.length]);

    const fetchLands = async () => {
        try {
            const landResponse = await axios.get('http://localhost:8080/lands', { withCredentials: true });
            setLands(landResponse.data);
        } catch (error) {
            console.error('Arazi verileri alınırken hata oluştu:', error);
            setSnackbarMessage('Arazi verileri alınırken bir hata oluştu.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const fetchSowings = async () => {
        try {
            const sowingResponse = await axios.get('http://localhost:8080/sowings', { withCredentials: true });
            setSowings(sowingResponse.data);
        } catch (error) {
            console.error('Ekim verileri alınırken hata oluştu:', error);
            setSnackbarMessage('Ekim verileri alınırken bir hata oluştu.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const calculateRemainingSize = () => {
        if (!sowing || !lands.length || !sowings.length) return;

        const land = lands.find(land => land.id === sowing.landId);
        if (!land) return;

        const landSize = land.landSize;

        const totalSownAmount = sowings
            .filter(s => s.landId === sowing.landId && s.id !== sowing.id)
            .reduce((total, s) => total + s.amount, 0);

        const remaining = landSize - totalSownAmount;

        setRemainingSize(remaining);
    };

    const handleSave = async () => {
        const newAmount = parseFloat(sowing.amount);

        if (newAmount > remainingSize) {
            setSnackbarMessage(`Ekilen alan, kalan alandan büyük olamaz. Kalan alan: ${remainingSize} m²`);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        // Tarih doğrulaması
        if (!validateDate(sowing.sowingDate)) {
            setSnackbarMessage('Girilen tarih geçerli değil. Lütfen geçerli bir tarih girin.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            await axios.put(`http://localhost:8080/sowings/update/${id}`, sowing, { withCredentials: true });

            setSnackbarMessage('Ekim güncellendi!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Kaydetme başarılı olunca sowing list sayfasına yönlendir
            setTimeout(() => {
                navigate('/sowing-list');  // Sowing list sayfasına yönlendirme
            }, 2000);  // 2 saniye bekleyip yönlendiriyoruz.

        } catch (error) {
            console.error('Ekim güncellenirken hata oluştu:', error);
            setSnackbarMessage('Ekim güncellenemedi.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };


    const validateDate = (date) => {
        const selectedDate = new Date(date);
        const minDate = new Date(getMinDate());
        const maxDate = new Date(getMaxDate());

        return selectedDate >= minDate && selectedDate <= maxDate;
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleNavigateToDetails = () => {
        navigate('/sowing-list');
    };

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/sowings/delete/${id}`, { withCredentials: true });
            setSnackbarMessage('Ekim başarıyla silindi!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setOpenDeleteDialog(false);
            navigate('/sowing-list');
        } catch (error) {
            console.error('Ekim silinirken hata oluştu:', error);
            setSnackbarMessage('Ekim silinirken bir hata oluştu.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const fetchCategoriesAndPlants = async (categoryId) => {
        try {
            const categoriesResponse = await axios.get('http://localhost:8080/categories', { withCredentials: true });
            setCategories(categoriesResponse.data);

            if (categoryId) {
                fetchPlants(categoryId);
            }
        } catch (error) {
            console.error('Kategoriler ve bitkiler alınırken hata oluştu:', error);
        }
    };

    const fetchPlants = async (categoryId) => {
        if (!categoryId) return;

        try {
            const response = await axios.get(`http://localhost:8080/plants/by-category?categoryId=${categoryId}`, { withCredentials: true });
            setPlants(response.data);
        } catch (error) {
            console.error('Bitkiler alınırken hata oluştu:', error);
        }
    };

    const handleCategoryChange = (event) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        setSowing(prevState => ({
            ...prevState,
            categoryId: newCategory,
            plantId: ''
        }));
        fetchPlants(newCategory);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSowing(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'amount') {
            calculateRemainingSize();
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // Minimum tarihi arazi tipine göre belirleme
    const getMinDate = () => {
        const selectedLand = lands.find(land => land.id === sowing.landId);
        if (selectedLand && (selectedLand.landType === 'Bahçe' || selectedLand.landType === 'Zeytinlik')) {
            return '1900-01-01'; // Bahçe ve Zeytinlik için 1900 yılına kadar izin ver
        }
        const currentDate = new Date();
        const lastYearDate = new Date();
        lastYearDate.setFullYear(currentDate.getFullYear() - 1);
        return lastYearDate.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    if (!sowing) {
        return <Typography>Yükleniyor...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    {isEditing ? 'Ekim Bilgilerini Düzenle' : `${sowing.plantName} Detayları`}
                </Typography>
                <Paper elevation={3} sx={{ p: 2, position: 'relative' }} ref={formRef}>
                    <IconButton
                        onClick={handleNavigateToDetails}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    {isEditing ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Arazi Adı: {sowing.landName}
                            </Typography>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Kategori</InputLabel>
                                <Select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.categoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Bitki</InputLabel>
                                <Select
                                    value={sowing.plantId || ''}
                                    onChange={handleChange}
                                    name="plantId"
                                    disabled={!selectedCategory}
                                >
                                    {plants.map((plant) => (
                                        <MenuItem key={plant.id} value={plant.id}>
                                            {plant.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Ekilen Alan"
                                name="amount"
                                value={sowing.amount}
                                onChange={handleChange}
                                margin="normal"
                                type="number"
                            />

                            <TextField
                                fullWidth
                                label="Tarih"
                                name="sowingDate"
                                type="date"
                                value={sowing.sowingDate.split('T')[0]}
                                onChange={handleChange}
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    inputProps: {
                                        min: getMinDate(),
                                        max: getMaxDate(),
                                    },
                                }}
                            />

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Düzenlenebilir Max Alan: {remainingSize < 0 ? 0 : remainingSize} m²
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6">Arazi Adı: {sowing.landName}</Typography>
                            <Typography variant="h6">Ekim Adı: {sowing.plantName}</Typography>
                            <Typography variant="h6">Kategori: {sowing.categoryName || 'Kategori Bilinmiyor'}</Typography>
                            <Typography variant="h6">Tarih: {sowing.sowingDate.split('T')[0]}</Typography>
                            <Typography variant="h6">Ekilen Alan: {sowing.amount} m²</Typography>
                            <Typography variant="h6">Düzenlenebilir Max Alan: {remainingSize < 0 ? 0 : remainingSize} m²</Typography>
                        </>
                    )}
                </Paper>
                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    {isEditing ? (
                        <>
                            <Button variant="contained" color="success" onClick={handleSave}>
                                Kaydet
                            </Button>

                        </>
                    ) : (
                        <>
                            <Button variant="contained" color="success" onClick={handleEditToggle}>
                                Düzenle
                            </Button>
                            <Button variant="contained" color="error" onClick={handleOpenDeleteDialog} sx={{ marginLeft: 2 }}>
                                Sil
                            </Button>
                        </>
                    )}
                </Box>

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
        </Container>
    );
};

export default SowingDetails;
