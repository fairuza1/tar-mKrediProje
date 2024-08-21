import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, TextField, MenuItem, FormControl, InputLabel, Select, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ilIlceData from '../Data/il-ilce.json';
import koylerData from '../Data/koyler.json';

const LandDetails = () => {
    const { id } = useParams();
    const [land, setLand] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [ilceler, setIlceler] = useState([]);
    const [koyler, setKoyler] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLandDetails();
    }, [id]);

    const fetchLandDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/lands/detail/${id}`);
            const data = await response.json();
            // Hesaplama işlemi
            const remainingArea = data.landSize - data.sowedArea;
            setLand({ ...data, remainingArea });
            if (data.city) {
                const ilceList = ilIlceData
                    .filter(item => item.il.localeCompare(data.city, undefined, { sensitivity: 'base' }) === 0)
                    .map(item => item.ilce);
                setIlceler(ilceList);
            }
            if (data.city && data.district) {
                const koyList = koylerData
                    .filter(item => item.il.localeCompare(data.city, undefined, { sensitivity: 'base' }) === 0 && item.ilce.localeCompare(data.district, undefined, { sensitivity: 'base' }) === 0)
                    .map(item => item.mahalle_koy);
                setKoyler(koyList);
            }
        } catch (error) {
            console.error('Error fetching land details:', error);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        fetch(`http://localhost:8080/lands/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(land),
        })
            .then(response => response.json())
            .then(data => {
                setLand(data);
                setIsEditing(false);
                setSnackbarMessage('Land updated successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            })
            .catch(error => {
                console.error('Error updating land details:', error);
                setSnackbarMessage('Failed to update the Land.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            });
    };

    const handleDelete = () => {
        fetch(`http://localhost:8080/lands/delete/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setSnackbarMessage('Land deleted successfully!');
                    setSnackbarSeverity('success');
                    setOpenSnackbar(true);
                    setOpenDeleteDialog(false);
                    navigate('/lands'); // Silme işleminden sonra kullanıcıyı liste sayfasına yönlendir
                } else {
                    setSnackbarMessage('Failed to delete the Land.');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                }
            })
            .catch(error => {
                console.error('Error deleting land:', error);
                setSnackbarMessage('Failed to delete the Land.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLand(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Benzersiz şehir isimlerini elde etme
    const uniqueCities = Array.from(new Set(ilIlceData.map(item => item.il)));

    if (!land) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    {isEditing ? 'Arazi Bilgilerini Düzenle' : `${land.name} Detayları`}
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
                                onChange={handleChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Ekili Alan (m²)"
                                name="sowedArea"
                                value={land.sowedArea}
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
                        </>
                    ) : (
                        <>
                            <Typography variant="h6">Boyut: {land.landSize} m²</Typography>
                            <Typography variant="h6">Ekili Alan: {land.sowedArea} m²</Typography>
                            <Typography variant="h6">Boş Alan: {land.remainingArea} m²</Typography>
                            <Typography variant="h6">Şehir: {land.city}</Typography>
                            <Typography variant="h6">İlçe: {land.district}</Typography>
                            <Typography variant="h6">Köy: {land.village || 'N/A'}</Typography>
                        </>
                    )}
                </Paper>
                <Box sx={{ marginTop: 3 }}>
                    {isEditing ? (
                        <>
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Kaydet
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleEditToggle} sx={{ marginLeft: 2 }}>
                                İptal
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="contained" color="primary" onClick={handleEditToggle}>
                                Düzenle
                            </Button>
                            <Button variant="contained" color="error" onClick={handleOpenDeleteDialog} sx={{ marginLeft: 2 }}>
                                Sil
                            </Button>
                        </>
                    )}
                </Box>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Silme Onay Modalı */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Silmek istediğinizden emin misiniz?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Bu işlem geri alınamaz. Silmek istediğinizden emin misiniz?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        İptal
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default LandDetails;