import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, FormControl, InputLabel, Select, Snackbar, Alert } from '@mui/material';
import ilIlceData from '../Data/il-ilce.json';
import koylerData from '../Data/koyler.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BreadcrumbComponent from "./BreadCrumb.jsx";

function AddLand() {
    const [landName, setLandName] = useState('');
    const [landSize, setLandSize] = useState('');
    const [selectedIl, setSelectedIl] = useState('');
    const [selectedIlce, setSelectedIlce] = useState('');
    const [selectedKoy, setSelectedKoy] = useState('');
    const [ilceler, setIlceler] = useState([]);
    const [koyler, setKoyler] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedIl) {
            const ilceList = ilIlceData
                .filter(item => item.il.localeCompare(selectedIl, undefined, { sensitivity: 'base' }) === 0)
                .map(item => item.ilce);
            setIlceler(ilceList);
            setSelectedIlce('');
            setKoyler([]);
            setSelectedKoy('');
        }
    }, [selectedIl]);

    useEffect(() => {
        if (selectedIlce) {
            const koyList = koylerData
                .filter(item => item.il.localeCompare(selectedIl, undefined, { sensitivity: 'base' }) === 0 && item.ilce.localeCompare(selectedIlce, undefined, { sensitivity: 'base' }) === 0)
                .map(item => item.mahalle_koy);
            setKoyler(koyList);
            setSelectedKoy('');
        } else {
            setKoyler([]);
        }
    }, [selectedIlce, selectedIl]);

    const handleAddLand = async (e) => {
        e.preventDefault();

        // Boş alan kontrolü
        if (!landName || !landSize || !selectedIl || !selectedIlce) {
            setSnackbarMessage('Please fill in all the fields.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const userId = localStorage.getItem('userId');

        const newLand = {
            name: landName,
            landSize: parseInt(landSize),
            city: selectedIl,
            district: selectedIlce,
            village: selectedKoy,
            user: { id: parseInt(userId) }
        };

        try {
            const response = await axios.post('http://localhost:8080/lands', newLand, { withCredentials: true });
            if (response.status === 200) {
                setSnackbarMessage('Land saved successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => navigate('/land-list'), 3000);
                setLandName('');
                setLandSize('');
                setSelectedIl('');
                setSelectedIlce('');
                setSelectedKoy('');
            } else {
                setSnackbarMessage('Failed to save the Land.');
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
            <Box>
                <BreadcrumbComponent pageName="Arazi Ekle" />
            </Box>
            <Box component="form" onSubmit={handleAddLand} sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Add Land
                </Typography>
                <TextField
                    fullWidth
                    label="Land Name"
                    variant="outlined"
                    margin="normal"
                    value={landName}
                    onChange={(e) => setLandName(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Land Size (hectares)"
                    variant="outlined"
                    margin="normal"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>İl</InputLabel>
                    <Select
                        value={selectedIl}
                        onChange={(e) => setSelectedIl(e.target.value)}
                    >
                        {Array.from(new Set(ilIlceData.map(item => item.il))).map(il => (
                            <MenuItem key={il} value={il}>{il}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" disabled={!selectedIl}>
                    <InputLabel>İlçe</InputLabel>
                    <Select
                        value={selectedIlce}
                        onChange={(e) => setSelectedIlce(e.target.value)}
                    >
                        {ilceler.map((ilce, index) => (
                            <MenuItem key={index} value={ilce}>{ilce}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" disabled={!selectedIlce || koyler.length === 0}>
                    <InputLabel>Köy/Mahalle</InputLabel>
                    <Select
                        value={selectedKoy}
                        onChange={(e) => setSelectedKoy(e.target.value)}
                    >
                        {koyler.map((koy, index) => (
                            <MenuItem key={index} value={koy}>{koy}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Add Land
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

export default AddLand;