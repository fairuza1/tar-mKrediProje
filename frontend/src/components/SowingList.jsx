import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const SowingList = () => {
    const [sowings, setSowings] = useState([]);
    const [lands, setLands] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [harvestedSowings, setHarvestedSowings] = useState(JSON.parse(localStorage.getItem('harvestedSowings')) || []);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
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
                    setSnackbarSeverity('error');
                    setSnackbarMessage('Ekim verileri alınırken bir hata oluştu.');
                    setSnackbarOpen(true);
                }
            }

            try {
                const landResponse = await axios.get('http://localhost:8080/lands', { withCredentials: true });
                setLands(landResponse.data);
            } catch (error) {
                console.error('Error fetching lands:', error);
                setError('Arazi verileri alınırken bir hata oluştu.');
                setSnackbarSeverity('error');
                setSnackbarMessage('Arazi verileri alınırken bir hata oluştu.');
                setSnackbarOpen(true);
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

    const handleHarvest = async (sowingId) => {
        const sowing = sowings.find(s => s.id === sowingId);
        if (!sowing) {
            console.error('Ekim bulunamadı:', sowingId);
            return;
        }

        const harvestData = {
            harvestDate: new Date(),
            sowingId: sowing.id,
        };

        try {
            const response = await axios.post('http://localhost:8080/harvests', harvestData, { withCredentials: true });
            const harvestedId = response.data.id; // Hasat kaydı oluşturulduktan sonra gelen ID

            const updatedHarvestedSowings = [...harvestedSowings, sowingId];
            setHarvestedSowings(updatedHarvestedSowings);
            localStorage.setItem('harvestedSowings', JSON.stringify(updatedHarvestedSowings));
            setSnackbarSeverity('success');
            setSnackbarMessage('Hasat başarıyla kaydedildi!');
            setSnackbarOpen(true);

            // Hasat başarılı ise 3 saniye sonra değerlendirme sayfasına yönlendir
            setTimeout(() => {
                navigate(`/rating/${harvestedId}`, { state: { harvestId: harvestedId } });
            }, 3000); // 3 saniye gecikme

        } catch (error) {
            console.error('Hasat kaydetme hatası:', error);
            setError('Hasat kaydedilirken bir hata oluştu.');
            setSnackbarSeverity('error');
            setSnackbarMessage('Hasat kaydedilirken bir hata oluştu.');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Arazi Alanı</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Ekilen Alan</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Boş Alan</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Zaman</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Aksiyonlar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sowings.map((sowing) => {
                                const land = getLand(sowing.landId);
                                const remainingSize = getRemainingSize(sowing.landId);
                                const isHarvested = harvestedSowings.includes(sowing.id);

                                return (
                                    <TableRow key={sowing.id}>
                                        <TableCell component="th" scope="row" sx={{ fontSize: '1rem' }}>
                                            {land ? land.name : 'Bilinmiyor'}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{land ? land.landType : 'Bilinmiyor'}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{sowing.plantName}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{land ? land.landSize : 'Bilinmiyor'}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{sowing.amount}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{remainingSize < 0 ? 0 : remainingSize}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>{new Date(sowing.sowingDate).toLocaleDateString()}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '1rem' }}>
                                            <Button variant="contained" color="primary" onClick={() => handleDetail(sowing.id)} disabled={isHarvested}>Detay</Button>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleHarvest(sowing.id)}
                                                sx={{ ml: 1 }}
                                                disabled={isHarvested}
                                            >
                                                {isHarvested ? 'Hasat Edildi' : 'Hasat Et'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SowingList;
