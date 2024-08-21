import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, TextField, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const SowingDetails = () => {
    const { id } = useParams();
    const [sowing, setSowing] = useState(null);
    const [categories, setCategories] = useState([]);
    const [plants, setPlants] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            await fetch(`http://localhost:8080/sowings/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sowing),
            });

            // Güncellemeyi başarıyla kaydettikten sonra en son verileri tekrar al
            const updatedDataResponse = await fetch(`http://localhost:8080/sowings/detail/${id}`);
            const updatedData = await updatedDataResponse.json();
            setSowing(updatedData);
            setIsEditing(false);
            setSnackbarMessage('Ekim güncellendi!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Ekim güncellenirken hata oluştu:', error);
            setSnackbarMessage('Ekim güncellenemedi.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    useEffect(() => {
        // Ekim detaylarını al
        const fetchSowingDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/sowings/detail/${id}`);
                const data = await response.json();
                setSowing(data);
                setSelectedCategory(data.category); // Mevcut kategori ayarlanıyor
                fetchCategoriesAndPlants(data.category); // Kategoriyi aldıktan sonra bitkileri yükle
            } catch (error) {
                console.error('Ekim detayları alınırken hata oluştu:', error);
            }
        };

        fetchSowingDetails();

        // Kategori ve bitkileri al
        const fetchCategoriesAndPlants = async (categoryId) => {
            try {
                const categoriesResponse = await axios.get('http://localhost:8080/categories', { withCredentials: true });
                setCategories(categoriesResponse.data);

                // Kategori seçildiğinde bitkileri yükle
                if (categoryId) {
                    const plantsResponse = await axios.get(`http://localhost:8080/plants/by-category?categoryId=${categoryId}`, { withCredentials: true });
                    setPlants(plantsResponse.data);
                }
            } catch (error) {
                console.error('Kategoriler ve bitkiler alınırken hata oluştu:', error);
            }
        };

        fetchSowingDetails();
    }, [id]);

    const handleCategoryChange = (event) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        setSowing(prevState => ({
            ...prevState,
            category: newCategory,
            plantId: '' // Yeni kategori seçildiğinde bitkiyi sıfırlıyoruz
        }));
        fetchPlants(newCategory); // Yeni kategori seçildiğinde bitkileri yükle
    };

    const fetchPlants = async (categoryId) => {
        try {
            const response = await axios.get(`http://localhost:8080/plants/by-category?categoryId=${categoryId}`, { withCredentials: true });
            setPlants(response.data);
        } catch (error) {
            console.error('Bitkiler alınırken hata oluştu:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSowing(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleBack = () => {
        navigate('/sowings'); // SowingList sayfasına yönlendir
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
                <Paper elevation={3} sx={{ p: 2 }}>
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
                            />
                        </>
                    ) : (
                        <>
                            <Typography variant="h6">Arazi Adı: {sowing.landName}</Typography>
                            <Typography variant="h6">Ekim Adı: {sowing.plantName}</Typography>
                            <Typography variant="h6">Tarih: {sowing.sowingDate.split('T')[0]}</Typography>
                            <Typography variant="h6">Kategori: {sowing.category}</Typography>
                            <Typography variant="h6">Ekilen Alan: {sowing.amount}</Typography>
                        </>
                    )}
                </Paper>
                <Box sx={{ marginTop: 3 }}>
                    {isEditing ? (
                        <>
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Kaydet
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleEditToggle} sx={{ marginLeft: 2 }}>
                                İptal
                            </Button>
                        </>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleEditToggle}>
                            Düzenle
                        </Button>
                    )}
                    <Button variant="outlined" onClick={handleBack} sx={{ marginLeft: 2 }}>
                        Geri
                    </Button>
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
        </Container>
    );
};

export default SowingDetails;
