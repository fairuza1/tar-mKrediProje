import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const LandList = () => {
    const [lands, setLands] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Başlangıçta true kabul edelim
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/lands', { withCredentials: true })
            .then(response => {
                console.log('Response:', response);
                setLands(response.data);
            })
            .catch(error => {
                console.error('Error fetching lands:', error);
                if (error.response && error.response.status === 401) {
                    setIsAuthenticated(false); // Eğer 401 Unauthorized hatası alırsanız, kullanıcı giriş yapmamış demektir
                }
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

    const handleDetail = (id) => {
        navigate(`/lands/detail/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/lands/edit/${id}`);
    };

    return (
        <Container maxWidth="md">
            <Box>
                <BreadcrumbComponent pageName="Arazilerim" />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Lands List
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="lands table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Size (hectares)</TableCell>
                                <TableCell align="right">City</TableCell>
                                <TableCell align="right">District</TableCell>
                                <TableCell align="right">Village</TableCell>
                                <TableCell align="right">Land Type</TableCell> {/* Arazi Tipi için yeni sütun */}
                                <TableCell align="center" colSpan={2}>Actions</TableCell> {/* Sütunları birleştirip Actions başlığını ortalıyoruz */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lands.map((land) => (
                                <TableRow key={land.id}>
                                    <TableCell component="th" scope="row">
                                        {land.name}
                                    </TableCell>
                                    <TableCell align="right">{land.landSize}</TableCell>
                                    <TableCell align="right">{land.city}</TableCell>
                                    <TableCell align="right">{land.district}</TableCell>
                                    <TableCell align="right">{land.village || 'N/A'}</TableCell>
                                    <TableCell align="right">{land.landType || 'N/A'}</TableCell> {/* Arazi Tipi */}
                                    <TableCell align="right">
                                        <Button variant="contained" color="primary" onClick={() => handleEdit(land.id)}>
                                            Düzenle
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button variant="outlined" color="secondary" onClick={() => handleDetail(land.id)}>
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

export default LandList;
