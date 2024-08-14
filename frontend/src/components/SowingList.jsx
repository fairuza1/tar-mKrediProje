import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BreadcrumbComponent from "./BreadCrumb.jsx";

const SowingList = () => {
    const [sowings, setSowings] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Başlangıçta true kabul edelim
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/sowings', { withCredentials: true })
            .then(response => {
                console.log('Response:', response);
                setSowings(response.data);
            })
            .catch(error => {
                console.error('Error fetching sowings:', error);
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
        navigate(`/sowings/detail/${id}`);
    };

    return (
        <Container maxWidth="md">
            <Box>
                <BreadcrumbComponent pageName="Ekimlerim" />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Sowings List
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="sowings table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Plant</TableCell>
                                <TableCell align="right">Date</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sowings.map((sowing) => (
                                <TableRow key={sowing.id}>
                                    <TableCell component="th" scope="row">
                                        {sowing.landName}
                                    </TableCell>
                                    <TableCell align="right">{sowing.plantName}</TableCell>
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
