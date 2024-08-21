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

    return (
        <Container maxWidth="lg"> {/* Tablonun genişliği için maxWidth 'lg' olarak ayarlandı */}
            <Box>
                <BreadcrumbComponent pageName="Arazilerim" />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Lands List
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}> {/* Yükseklik sınırlaması eklendi */}
                    <Table sx={{ minWidth: 900 }} aria-label="lands table"> {/* minWidth artırıldı */}
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Arazi İsmi</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Arazi Alanı (m²)</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Şehir</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>İlçe</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Köy</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Arazi tipi</TableCell> {/* Arazi Tipi için yeni sütun */}
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Actions</TableCell> {/* Sadece Actions başlığını bıraktık */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lands.map((land) => (
                                <TableRow key={land.id}>
                                    <TableCell component="th" scope="row" sx={{ fontSize: '1rem' }}>
                                        {land.name}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontSize: '1rem' }}>{land.landSize}</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '1rem' }}>{land.city}</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '1rem' }}>{land.district}</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '1rem' }}>{land.village || 'N/A'}</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '1rem' }}>{land.landType || 'N/A'}</TableCell> {/* Arazi Tipi */}
                                    <TableCell align="center" sx={{ fontSize: '1rem' }}>
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
