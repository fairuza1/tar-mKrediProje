import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const Harvest = () => {
    const [harvests, setHarvests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHarvests = async () => {
            try {
                const response = await axios.get('http://localhost:8080/harvests', { withCredentials: true });
                setHarvests(response.data);
            } catch (error) {
                console.error('Error fetching harvests:', error);
                setError('Hasat verileri alınırken bir hata oluştu.');
            }
        };

        fetchHarvests();
    }, []);

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
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Ekim</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Bitki</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Hasat Miktarı</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Hasat Tarihi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {harvests.map((harvest) => (
                                <TableRow key={harvest.id}>
                                    <TableCell component="th" scope="row" sx={{ fontSize: '1rem' }}>
                                        {harvest.sowingId}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontSize: '1rem' }}>{harvest.plantName}</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '1rem' }}>{harvest.amount}</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '1rem' }}>{new Date(harvest.harvestDate).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default Harvest;
