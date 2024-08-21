import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const SowingList = () => {
    const [sowings, setSowings] = useState([]);
    const [lands, setLands] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sowingResponse = await axios.get('http://localhost:8080/sowings', { withCredentials: true });
                setSowings(sowingResponse.data);
            } catch (error) {
                console.error('Error fetching sowings:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                } else {
                    setError('Ekim verileri alınırken bir hata oluştu.');
                }
            }

            try {
                const landResponse = await axios.get('http://localhost:8080/lands', { withCredentials: true });
                setLands(landResponse.data);
            } catch (error) {
                console.error('Error fetching lands:', error);
                setError('Arazi verileri alınırken bir hata oluştu.');
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

    const getRemainingSize = (landId) => {
        const land = getLand(landId);
        if (!land) return 0;

        const landSize = land.landSize;
        const totalSownAmount = sowings
            .filter(sowing => sowing.landId === landId)
            .reduce((sum, sowing) => sum + sowing.amount, 0);

        return landSize - totalSownAmount;
    };

    const handleDetail = (id) => {
        navigate(`/sowings/detail/${id}`);
    };

    const handleHarvest = (sowingId) => {
        // Burada hasat etme işlemini gerçekleştiren bir fonksiyon çağırılabilir.
        console.log(`Hasat ediliyor: ${sowingId}`);
        // Örneğin, hasat etme API'sini çağırabilirsiniz.
    };

    return (
        <Container maxWidth="lg">
            <Box>
                <BreadcrumbComponent pageName="Ekimlerim" />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Ekimlerim Listesi
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}>
                    <Table sx={{ minWidth: 900 }} aria-label="sowings table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Arazim</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Arazi Tipi</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Bitki</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Arazi Alanı</TableCell> {/* 4. Sıra */}
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Ekilen Alan</TableCell> {/* 5. Sıra */}
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Boş Alan</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Zaman</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Aksiyonlar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sowings.map((sowing) => {
                                const land = getLand(sowing.landId);
                                const remainingSize = getRemainingSize(sowing.landId);
                                return (
                                    <TableRow key={sowing.id}>
                                        <TableCell component="th" scope="row" sx={{ fontSize: '1rem' }}>
                                            {land ? land.name : 'Bilinmiyor'}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{land ? land.landType : 'Bilinmiyor'}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{sowing.plantName}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{land ? land.landSize : 'Bilinmiyor'}</TableCell> {/* Arazi Alanı 4. Sıra */}
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{sowing.amount}</TableCell> {/* Ekilen Alan 5. Sıra */}
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{remainingSize < 0 ? 0 : remainingSize}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{new Date(sowing.sowingDate).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">
                                            <Button variant="contained" color="primary" onClick={() => handleDetail(sowing.id)} sx={{ ml: 2 }}>
                                                Detay
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={() => handleHarvest(sowing.id)} sx={{ ml: 2 }}>
                                                Hasat Et
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

export default SowingList;
