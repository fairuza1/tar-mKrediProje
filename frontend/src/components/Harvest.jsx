import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Button,
    Snackbar,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const Harvest = ({ onSowingUpdate }) => {
    const [harvests, setHarvests] = useState([]);
    const [sowings, setSowings] = useState([]);
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [harvestedSowings, setHarvestedSowings] = useState(JSON.parse(localStorage.getItem('harvestedSowings')) || []);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
                setLoading(false); // Set loading to false after fetch
            }
        };

        fetchAllData();
    }, []);

    const getLand = (landId) => lands.find(land => land.id === landId);
    const getSowing = (sowingId) => sowings.find(sowing => sowing.id === sowingId);

    const handleDelete = async (harvestId, sowingId) => {
        try {
            await axios.delete(`http://localhost:8080/harvests/${harvestId}`, { withCredentials: true });
            const updatedHarvests = harvests.filter(h => h.id !== harvestId);
            setHarvests(updatedHarvests);
            const updatedHarvestedSowings = harvestedSowings.filter(id => id !== sowingId);
            setHarvestedSowings(updatedHarvestedSowings);
            localStorage.setItem('harvestedSowings', JSON.stringify(updatedHarvestedSowings));

            if (onSowingUpdate && typeof onSowingUpdate === 'function') { // Check if onSowingUpdate is a function
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
                {loading ? ( // Display loading indicator
                    <CircularProgress />
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}>
                        <Table sx={{ minWidth: 900 }} aria-label="harvests table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Arazi Adı</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Arazi Tipi</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Ekilen Alan (m²)</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Hasat Tarihi</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Aksiyonlar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {harvests.map((harvest) => {
                                    const sowing = getSowing(harvest.sowingId);
                                    const land = sowing ? getLand(sowing.landId) : null;

                                    return (
                                        <TableRow key={harvest.id}>
                                            <TableCell component="th" scope="row" sx={{ fontSize: '1rem' }}>
                                                {land ? land.name : 'Bilinmiyor'}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '1rem' }}>{land ? land.landType : 'Bilinmiyor'}</TableCell>
                                            <TableCell align="right" sx={{ fontSize: '1rem' }}>{sowing ? sowing.amount : 'Bilinmiyor'} m²</TableCell>
                                            <TableCell align="right" sx={{ fontSize: '1rem' }}>{new Date(harvest.harvestDate).toLocaleDateString()}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleDelete(harvest.id, sowing.id)}
                                                >
                                                    Sil
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
