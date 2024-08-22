import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Button } from '@mui/material';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const Harvest = () => {
    const [harvests, setHarvests] = useState([]);
    const [sowings, setSowings] = useState([]);
    const [lands, setLands] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHarvests = async () => {
            try {
                const harvestResponse = await axios.get('http://localhost:8080/harvests', { withCredentials: true });
                setHarvests(harvestResponse.data);
            } catch (error) {
                console.error('Error fetching harvests:', error);
                setError('Hasat verileri alınırken bir hata oluştu.');
            }
        };

        const fetchSowings = async () => {
            try {
                const sowingResponse = await axios.get('http://localhost:8080/sowings', { withCredentials: true });
                setSowings(sowingResponse.data);
            } catch (error) {
                console.error('Error fetching sowings:', error);
                setError('Ekim verileri alınırken bir hata oluştu.');
            }
        };

        const fetchLands = async () => {
            try {
                const landResponse = await axios.get('http://localhost:8080/lands', { withCredentials: true });
                setLands(landResponse.data);
            } catch (error) {
                console.error('Error fetching lands:', error);
                setError('Arazi verileri alınırken bir hata oluştu.');
            }
        };

        fetchHarvests();
        fetchSowings();
        fetchLands();
    }, []);

    const getLand = (landId) => {
        return lands.find(land => land.id === landId);
    };

    const getSowing = (sowingId) => {
        return sowings.find(sowing => sowing.id === sowingId);
    };

    const handleDelete = async (harvestId) => {
        try {
            await axios.delete(`http://localhost:8080/harvests/${harvestId}`, { withCredentials: true });
            setHarvests(harvests.filter(harvest => harvest.id !== harvestId));
            alert('Hasat başarıyla silindi!');
        } catch (error) {
            console.error('Hasat silinirken bir hata oluştu:', error);
            setError('Hasat silinirken bir hata oluştu.');
        }
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
                                            {land ? land.name : 'Bilinmiyor'} {/* Arazi Adı */}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{land ? land.landType : 'Bilinmiyor'}</TableCell> {/* Arazi Tipi */}
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{sowing ? sowing.amount : 'Bilinmiyor'} m²</TableCell> {/* Ekilen Alan */}
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{new Date(harvest.harvestDate).toLocaleDateString()}</TableCell> {/* Hasat Tarihi */}
                                        <TableCell align="right">
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDelete(harvest.id)}
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
            </Box>
        </Container>
    );
};

export default Harvest;
