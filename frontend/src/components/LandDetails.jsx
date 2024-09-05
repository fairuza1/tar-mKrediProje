import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
    Alert,
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ilIlceData from '../Data/il-ilce.json';
import koylerData from '../Data/koyler.json';

const LandDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const { editMode } = location.state || {};
    const [land, setLand] = useState(null);
    const [isEditing, setIsEditing] = useState(editMode || false);
    const [ilceler, setIlceler] = useState([]);
    const [koyler, setKoyler] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Tek bir snackbar kullanılıyor
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLandDetails();
    }, [id]);

    const fetchLandDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/lands/detail/${id}`);
            const data = await response.json();
            const remainingArea = data.landSize - data.sowedArea;
            setLand({ ...data, remainingArea });
            if (data.city) {
                const ilceList = ilIlceData
                    .filter(item => item.il.localeCompare(data.city, undefined, { sensitivity: 'base' }) === 0)
                    .map(item => item.ilce);
                setIlceler(ilceList);
                fetchKoyler(data.city, data.district);
            }
        } catch (error) {
            console.error('Error fetching land details:', error);
        }
    };

    const fetchKoyler = (city, district) => {
        const koyList = koylerData
            .filter(item => item.il.localeCompare(city, undefined, { sensitivity: 'base' }) === 0 && item.ilce.localeCompare(district, undefined, { sensitivity: 'base' }) === 0)
            .map(item => item.mahalle_koy);
        setKoyler(koyList);
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('land', new Blob([JSON.stringify(land)], { type: "application/json" }));
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        fetch(`http://localhost:8080/lands/update/${id}`, {
            method: 'PUT',
            body: formData,
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setLand(data);
                setIsEditing(false);
                // Başarı durumunda land-list sayfasına yönlendirme ve başarı mesajı taşıma
                navigate('/land-list', {
                    state: {
                        message: 'Arazi bilgileri başarıyla güncellendi!',
                        severity: 'success'
                    }
                });
            })
            .catch(error => {
                console.error('Error updating land details:', error);
                // Hata durumunda land-list sayfasına yönlendirme ve hata mesajı taşıma
                navigate('/land-list', {
                    state: {
                        message: 'Arazi güncellenemedi. Lütfen tekrar deneyin.',
                        severity: 'error'
                    }
                });
            });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLand(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'city') {
            const ilceList = ilIlceData
                .filter(item => item.il.localeCompare(value, undefined, { sensitivity: 'base' }) === 0)
                .map(item => item.ilce);
            setIlceler(ilceList);
            setKoyler([]);
            setLand(prevState => ({ ...prevState, district: '', village: '' }));
        } else if (name === 'district') {
            fetchKoyler(land.city, value);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const uniqueCities = Array.from(new Set(ilIlceData.map(item => item.il)));

    if (!land) {
        return <Typography>Yükleniyor...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    {isEditing ? 'Arazi Bilgilerini Düzenle' : ''}
                </Typography>
                <Paper elevation={3} sx={{ p: 2 }}>
                    {isEditing ? (
                        <>
                            <TextField
                                fullWidth
                                label="Arazi Adı"
                                name="name"
                                value={land.name}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Boyut (m²)"
                                name="landSize"
                                value={land.landSize}
                                type="number"
                                onChange={handleChange}
                                margin="normal"
                            />

                            <FormControl fullWidth margin="normal">
                                <InputLabel>İl</InputLabel>
                                <Select
                                    name="city"
                                    value={land.city}
                                    onChange={handleChange}
                                >
                                    {uniqueCities.map(il => (
                                        <MenuItem key={il} value={il}>{il}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal" disabled={!land.city}>
                                <InputLabel>İlçe</InputLabel>
                                <Select
                                    name="district"
                                    value={land.district}
                                    onChange={handleChange}
                                >
                                    {ilceler.map((ilce, index) => (
                                        <MenuItem key={index} value={ilce}>{ilce}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal" disabled={!land.district || koyler.length === 0}>
                                <InputLabel>Köy/Mahalle</InputLabel>
                                <Select
                                    name="village"
                                    value={land.village || ''}
                                    onChange={handleChange}
                                >
                                    {koyler.map((koy, index) => (
                                        <MenuItem key={index} value={koy}>{koy}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                type="file"
                                fullWidth
                                name="image"
                                margin="normal"
                                onChange={handleImageUpload}
                            />
                        </>
                    ) : null}
                </Paper>
                <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    {isEditing ? (
                        <Button variant="contained" color="success" onClick={handleSave}>
                            Kaydet
                        </Button>
                    ) : null}
                </Box>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Sol altta bildirim
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default LandDetails;
