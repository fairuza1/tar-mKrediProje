import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const SowingList = () => {
    const [sowings, setSowings] = useState([]);
    const [lands, setLands] = useState([]); // Arazi verileri
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Sowing verilerini almak
        axios.get('http://localhost:8080/sowings', { withCredentials: true })
            .then(response => {
                setSowings(response.data);
            })
            .catch(error => {
                console.error('Error fetching sowings:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false);
                }
            });

        // Arazi verilerini almak
        axios.get('http://localhost:8080/lands', { withCredentials: true })
            .then(response => {
                setLands(response.data);
            })
            .catch(error => {
                console.error('Error fetching lands:', error);
            });
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

    // Arazi tipini almak için yardımcı fonksiyon
    const getLandType = (landName) => {
        const land = lands.find(land => land.name === landName);
        return land ? land.landType : 'Bilinmiyor'; // `landType` yerine `landType` kullanıyoruz
    };

    // Arazi boyutunu almak için yardımcı fonksiyon
    const getLandSize = (landName) => {
        const land = lands.find(land => land.name === landName);
        return land ? land.landSize : 'Bilinmiyor';
    };

    const handleDetail = (id) => {
        navigate(`/sowings/detail/${id}`);
    };

    return (
        <Container maxWidth="md">
            <Box>
                <BreadcrumbComponent pageName="Ekimlerim" />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Ekimlerim Listesi
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="sowings table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Arazim</TableCell>
                                <TableCell align="right">Arazi Tipi</TableCell>
                                <TableCell align="right">Bitki</TableCell>
                                <TableCell align="right">Arazi Alanı</TableCell> {/* Yer değişti */}
                                <TableCell align="right">Ekilen Alan</TableCell> {/* Yer değişti */}
                                <TableCell align="right">Boş Alan</TableCell>
                                <TableCell align="right">Zaman</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sowings.map((sowing) => (
                                <TableRow key={sowing.id}>
                                    <TableCell component="th" scope="row">
                                        {sowing.landName}
                                    </TableCell>
                                    <TableCell align="right">{getLandType(sowing.landName)}</TableCell>
                                    <TableCell align="right">{sowing.plantName}</TableCell>
                                    <TableCell align="right">{getLandSize(sowing.landName)}</TableCell> {/* Yer değişti */}
                                    <TableCell align="right">{sowing.amount}</TableCell> {/* Yer değişti */}
                                    <TableCell align="right">{getLandSize(sowing.landName) - sowing.amount}</TableCell>
                                    <TableCell align="right">{sowing.sowingDate}</TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" color="primary" onClick={() => handleDetail(sowing.id)} sx={{ ml: 2 }}>
                                            Detay
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default SowingList;
