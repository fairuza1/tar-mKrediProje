import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, FormControl, InputLabel, Select, Snackbar, Alert, Table, TableBody, TableCell, TableHead, TableRow, Grid, Avatar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BreadcrumbComponent from "./BreadCrumb";

function AddSowing() {
    const [plantId, setPlantId] = useState('');
    const [sowingDate, setSowingDate] = useState('');
    const [landId, setLandId] = useState('');
    const [amount, setAmount] = useState('');
    const [plants, setPlants] = useState([]);
    const [lands, setLands] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [yieldPerSquareMeterByPlant, setYieldPerSquareMeterByPlant] = useState({});
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories', { withCredentials: true });
                setCategories(response.data);
            } catch (error) {
                console.log("Error Fetching Categories", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPlantsAndLands = async () => {
            try {
                const [plantsResponse, landsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/plants', { withCredentials: true }),
                    axios.get('http://localhost:8080/lands', { withCredentials: true })
                ]);
                setPlants(plantsResponse.data);
                setLands(landsResponse.data);
            } catch (error) {
                console.error('Error fetching plants and lands:', error);
            }
        };

        fetchPlantsAndLands();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const fetchPlantsByCategory = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/plants/by-category?categoryId=${selectedCategory}`, { withCredentials: true });
                    setPlants(response.data);
                } catch (error) {
                    console.log("Error Fetching Plants", error);
                }
            };

            fetchPlantsByCategory();
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (landId) {
            const selectedLand = lands.find(land => land.id === parseInt(landId));
            const city = selectedLand ? selectedLand.city : '';
            const district = selectedLand ? selectedLand.district : '';

            if (city && district) {
                const fetchRecommendations = async () => {
                    try {
                        const response = await axios.get(`http://localhost:8080/api/ratings/recommendations?city=${city}&district=${district}`, { withCredentials: true });
                        setRecommendations(Object.entries(response.data));

                        // Metrekare başına düşen ürün miktarını al
                        const yieldResponse = await axios.get(`http://localhost:8080/api/ratings/yield-per-square-meter-by-plant?city=${city}&district=${district}`, { withCredentials: true });
                        setYieldPerSquareMeterByPlant(yieldResponse.data);

                    } catch (error) {
                        console.error('Error fetching recommendations and yield per square meter:', error);
                    }
                };

                fetchRecommendations();
            }
        }
    }, [landId, lands]);

    const getLandSize = (landId) => {
        const land = lands.find(land => land.id === landId);
        return land ? land.landSize : 0;
    };

    const getLandSownAmount = async (landId) => {
        try {
            const response = await axios.get(`http://localhost:8080/sowings/land/${landId}`, { withCredentials: true });
            return response.data.reduce((total, sowing) => total + sowing.amount, 0);
        } catch (error) {
            console.error('Error fetching sowing amounts for land:', error);
            return 0;
        }
    };

    const handleAddSowing = async (e) => {
        e.preventDefault();

        if (!plantId || !landId || !amount || !sowingDate) {
            setSnackbarMessage('Please fill in all the fields.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const landSize = getLandSize(landId);
        const sownAmount = await getLandSownAmount(landId);
        const remainingSize = landSize - sownAmount;

        if (parseFloat(amount) > remainingSize) {
            setSnackbarMessage(`Eklenen alan, arazi alanından fazla. Kalan alan: ${remainingSize}`);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const newSowing = {
            plantId: parseInt(plantId),
            sowingDate: sowingDate,
            landId: parseInt(landId),
            amount: parseFloat(amount),
            remainingSize
        };

        try {
            const response = await axios.post('http://localhost:8080/sowings', newSowing, { withCredentials: true });
            if (response.status === 200) {
                setSnackbarMessage('Sowing saved successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);

                setTimeout(() => navigate('/sowing-list'), 3000);
                setPlantId('');
                setSowingDate('');
                setLandId('');
                setAmount('');
            } else {
                setSnackbarMessage('Failed to save the Sowing.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data
                ? error.response.data
                : 'Bir hata oluştu. Lütfen tekrar deneyin.';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="lg">
            <Box>
                <BreadcrumbComponent pageName="Ekim Yap ve Önerilen Bitkiler" />
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box component="form" onSubmit={handleAddSowing} sx={{ mt: 3 }}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            Ekim Yap
                        </Typography>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Arazilerim</InputLabel>
                            <Select
                                value={landId}
                                onChange={(e) => setLandId(e.target.value)}
                            >
                                {lands.map((land) => (
                                    <MenuItem key={land.id} value={land.id}>{land.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Kategori</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>{category.categoryName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Bitki</InputLabel>
                            <Select
                                value={plantId}
                                onChange={(e) => setPlantId(e.target.value)}
                                disabled={!selectedCategory}
                            >
                                {plants.map((plant) => (
                                    <MenuItem key={plant.id} value={plant.id}>{plant.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Ekilen Alan (m²)"
                            type="number"
                            variant="outlined"
                            margin="normal"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />

                        <TextField
                            fullWidth
                            label="Ekim Tarihi"
                            type="date"
                            variant="outlined"
                            margin="normal"
                            value={sowingDate}
                            onChange={(e) => setSowingDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Ekim Ekle
                        </Button>

                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Önerilen Bitkiler
                    </Typography>
                    {recommendations.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Bitki</TableCell>
                                    <TableCell align="right">Puan</TableCell>
                                    <TableCell align="right">Metrekare Başına Ürün (kg/m²)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recommendations.map(([plantName, score], index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Avatar
                                                    src={`/images/Plant/${plantName.toLowerCase()}.jpg`}
                                                    alt={plantName}
                                                    sx={{ mr: 2 }}
                                                />
                                                {plantName}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">{(score * 20).toFixed(2)}%</TableCell>
                                        <TableCell align="right">
                                            {yieldPerSquareMeterByPlant[plantName] ? yieldPerSquareMeterByPlant[plantName].toFixed(2) : 'N/A'} kg/m²
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography variant="body1">
                            Seçilen arazi için öneri bulunmamaktadır.
                        </Typography>
                    )}
                </Grid>
            </Grid>

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
}

export default AddSowing;
