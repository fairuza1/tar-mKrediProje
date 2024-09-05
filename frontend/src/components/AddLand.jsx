import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
    Alert,
    InputAdornment
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // İkonlar için MUI Icons kullandım
import ilIlceData from '../Data/il-ilce.json';
import koylerData from '../Data/koyler.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BreadcrumbComponent from './BreadCrumb.jsx';
import ImageUploader from './ImageUploader'; // ImageUploader bileşeni
import ScrollToTop from './ScrollToTop'; // ScrollToTop bileşeni

function AddLand() {
    const [landName, setLandName] = useState('');
    const [landSize, setLandSize] = useState('');
    const [landType, setLandType] = useState('');
    const [selectedIl, setSelectedIl] = useState('');
    const [selectedIlce, setSelectedIlce] = useState('');
    const [selectedKoy, setSelectedKoy] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // Resim URL'sini tutmak için state
    const [ilceler, setIlceler] = useState([]);
    const [koyler, setKoyler] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedIl) {
            const ilceList = ilIlceData
                .filter(item => item.il.localeCompare(selectedIl, undefined, { sensitivity: 'base' }) === 0)
                .map(item => item.ilce);
            setIlceler(ilceList);
            setSelectedIlce('');
            setKoyler([]);
            setSelectedKoy('');
        }
    }, [selectedIl]);

    useEffect(() => {
        if (selectedIlce) {
            const koyList = koylerData
                .filter(item => item.il.localeCompare(selectedIl, undefined, { sensitivity: 'base' }) === 0 && item.ilce.localeCompare(selectedIlce, undefined, { sensitivity: 'base' }) === 0)
                .map(item => item.mahalle_koy);
            setKoyler(koyList);
            setSelectedKoy('');
        } else {
            setKoyler([]);
        }
    }, [selectedIlce, selectedIl]);

    const handleAddLand = async (e) => {
        e.preventDefault();

        // Alanları doğrulama
        if (!landName || !landSize || !selectedIl || !selectedIlce || !landType) {
            setSnackbarMessage('Lütfen tüm zorunlu alanları doldurun.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const userId = localStorage.getItem('userId');

        const newLand = {
            name: landName,
            landSize: parseInt(landSize),
            landType: landType,
            city: selectedIl,
            district: selectedIlce,
            village: selectedKoy,
            userId: parseInt(userId)
        };

        const formData = new FormData();
        formData.append('land', new Blob([JSON.stringify(newLand)], { type: 'application/json' }));

        if (imageUrl) {
            formData.append('file', imageUrl);
        }

        try {
            const response = await axios.post('http://localhost:8080/lands', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (response.status === 201) {
                setSnackbarMessage('Arazi başarıyla kaydedildi!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => navigate('/land-list'), 3000);
                resetForm();
            } else {
                setSnackbarMessage('Arazi kaydedilemedi.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Hata: ' + error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const resetForm = () => {
        setLandName('');
        setLandSize('');
        setLandType('');
        setSelectedIl('');
        setSelectedIlce('');
        setSelectedKoy('');
        setImageUrl('');
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };


    return (
        <Container maxWidth="sm" sx={{  minHeight: '100vh', padding: 3 }}>
            <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 4, boxShadow: 7 }}>
                <BreadcrumbComponent pageName="Arazi Ekle"  />

                <Box component="form" onSubmit={handleAddLand} sx={{ mt: 3 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'green', fontWeight: 'bold' }}>
                        Arazi Ekle
                    </Typography>

                    <TextField
                        fullWidth
                        label="Arazi ismi giriniz"
                        variant="outlined"
                        margin="normal"
                        value={landName}
                        onChange={(e) => setLandName(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOnIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Arazi boyutu giriniz (m²)"
                        variant="outlined"
                        margin="normal"
                        type="number"
                        value={landSize}
                        onChange={(e) => setLandSize(e.target.value)}
                    />

                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel>Arazi Tipi</InputLabel>
                        <Select
                            fullWidth
                            value={landType}
                            onChange={(e) => setLandType(e.target.value)}
                            label="Arazi Tipi"
                        >
                            <MenuItem value="Tarla">Tarla</MenuItem>
                            <MenuItem value="Bahçe">Bahçe</MenuItem>
                            <MenuItem value="Bağ">Bağ</MenuItem>
                            <MenuItem value="Zeytinlik">Zeytinlik</MenuItem>
                            <MenuItem value="Çayır">Çayır</MenuItem>
                            <MenuItem value="Mera">Mera</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel>İl</InputLabel>
                        <Select
                            value={selectedIl}
                            onChange={(e) => setSelectedIl(e.target.value)}
                            label="İl"
                        >
                            {Array.from(new Set(ilIlceData.map(item => item.il))).map(il => (
                                <MenuItem key={il} value={il}>{il}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" variant="outlined" disabled={!selectedIl}>
                        <InputLabel>İlçe</InputLabel>
                        <Select
                            value={selectedIlce}
                            onChange={(e) => setSelectedIlce(e.target.value)}
                            label="İlçe"
                        >
                            {ilceler.map((ilce, index) => (
                                <MenuItem key={index} value={ilce}>{ilce}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" variant="outlined" disabled={!selectedIlce || koyler.length === 0}>
                        <InputLabel>Köy/Mahalle</InputLabel>
                        <Select
                            value={selectedKoy}
                            onChange={(e) => setSelectedKoy(e.target.value)}
                            label="Köy/Mahalle"
                        >
                            {koyler.map((koy, index) => (
                                <MenuItem key={index} value={koy}>{koy}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Image Uploader */}
                    <Box sx={{ border: '1px dashed grey', padding: 2, borderRadius: 1, textAlign: 'center', marginTop: '16px' }}>
                        <ImageUploader onImageUpload={setImageUrl} />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            backgroundColor: 'green',
                            color: 'white',
                            borderRadius: '25px',
                            padding: '10px',
                            textTransform: 'normal',
                            fontSize: '1rem',
                            '&:hover': {
                                backgroundColor: 'success.dark',
                            },
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        kaydet
                    </Button>
                </Box>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>

            <ScrollToTop />
        </Container>
    );
}

export default AddLand;
