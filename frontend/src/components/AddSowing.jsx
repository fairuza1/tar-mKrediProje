import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, FormControl, InputLabel, Select, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddSowing() {
    const [plantId, setPlantId] = useState('');
    const [sowingDate, setSowingDate] = useState('');
    const [landId, setLandId] = useState('');
    const [plants, setPlants] = useState([]);
    const [lands, setLands] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        // Bitkileri ve arazileri API'den çekmek için istekler
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

    const handleAddSowing = async (e) => {
        e.preventDefault();

        // Boş alan kontrolü
        if (!plantId || !sowingDate || !landId) {
            setSnackbarMessage('Please fill in all the fields.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const newSowing = {
            plantId: parseInt(plantId),
            sowingDate: sowingDate,
            landId: parseInt(landId)
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
            } else {
                setSnackbarMessage('Failed to save the Sowing.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Error: ' + error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="sm">
            <Box component="form" onSubmit={handleAddSowing} sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Add Sowing
                </Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Plant</InputLabel>
                    <Select
                        value={plantId}
                        onChange={(e) => setPlantId(e.target.value)}
                    >
                        {plants.map((plant) => (
                            <MenuItem key={plant.id} value={plant.id}>{plant.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Sowing Date"
                    type="date"
                    variant="outlined"
                    margin="normal"
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Land</InputLabel>
                    <Select
                        value={landId}
                        onChange={(e) => setLandId(e.target.value)}
                    >
                        {lands.map((land) => (
                            <MenuItem key={land.id} value={land.id}>{land.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Add Sowing
                </Button>
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
}

export default AddSowing;
