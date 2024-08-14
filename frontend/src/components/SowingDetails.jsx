import React, {useState, useEffect} from 'react';
import {Container, Typography, Box, Paper, Button, TextField, MenuItem, FormControl, InputLabel, Select, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import ilIlceData from '../Data/il-ilce.json';
import koylerData from '../Data/koyler.json';

const SowingDetails = () => {
    const {id} = useParams();
    const [sowing, setSowing] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [ilceler, setIlceler] = useState([]);
    const [koyler, setKoyler] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const navigate = useNavigate();

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        fetch(`http://localhost:8080/sowings/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sowing),
        })
            .then(response => response.json())
            .then(data => {
                setSowing(data);
                setIsEditing(false);
                setSnackbarMessage('Sowing updated successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            })
            .catch(error => {
                console.error('Error updating sowing details:', error);
                setSnackbarMessage('Failed to update the Sowing.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            });
    };

    const handleDelete = () => {
        fetch(`http://localhost:8080/sowings/delete/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setSnackbarMessage('Sowing deleted successfully!');
                    setSnackbarSeverity('success');
                    setOpenSnackbar(true);
                    setOpenDeleteDialog(false);
                    navigate('/sowings'); // Silme işleminden sonra kullanıcıyı liste sayfasına yönlendir
                } else {
                    setSnackbarMessage('Failed to delete the Sowing.');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                }
            })
            .catch(error => {
                console.error('Error deleting sowing:', error);
                setSnackbarMessage('Failed to delete the Sowing.');
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

    useEffect(() => {
        fetch(`http://localhost:8080/sowings/detail/${id}`)
            .then(response => response.json())
            .then(data => {
                setSowing(data);
                if (data.city) {
                    const ilceList = ilIlceData
                        .filter(item => item.il.localeCompare(data.city, undefined, {sensitivity: 'base'}) === 0)
                        .map(item => item.ilce);
                    setIlceler(ilceList);
                }
                if (data.city && data.district) {
                    const koyList = koylerData
                        .filter(item => item.il.localeCompare(data.city, undefined, {sensitivity: 'base'}) === 0 && item.ilce.localeCompare(data.district, undefined, {sensitivity: 'base'}) === 0)
                        .map(item => item.mahalle_koy);
                    setKoyler(koyList);
                }
            })
            .catch(error => console.error('Error fetching sowing details:', error));
    }, [id]);

    useEffect(() => {
        if (sowing?.city) {
            const ilceList = ilIlceData
                .filter(item => item.il.localeCompare(sowing.city, undefined, {sensitivity: 'base'}) === 0)
                .map(item => item.ilce);
            setIlceler(ilceList);

            if (!ilceList.includes(sowing.district)) {
                setSowing(prevState => ({...prevState, district: '', village: ''}));
            }
        }
    }, [sowing?.city]);

    useEffect(() => {
        if (sowing?.district) {
            const koyList = koylerData
                .filter(item => item.il.localeCompare(sowing.city, undefined, {sensitivity: 'base'}) === 0 && item.ilce.localeCompare(sowing.district, undefined, {sensitivity: 'base'}) === 0)
                .map(item => item.mahalle_koy);
            setKoyler(koyList);

            if (!koyList.includes(sowing.village)) {
                setSowing(prevState => ({...prevState, village: ''}));
            }
        } else {
            setKoyler([]);
        }
    }, [sowing?.district]);

    if (!sowing) {
        return <Typography>Loading...</Typography>;
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSowing(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Benzersiz şehir isimlerini elde etme
    const uniqueCities = Array.from(new Set(ilIlceData.map(item => item.il)));

    return (
        <Container maxWidth="md">
            <Box sx={{mt: 3}}>
                <Typography variant="h4" component="h2" gutterBottom>
                    {isEditing ? 'Ekim Bilgilerini Düzenle' : `${sowing.plantName} Detayları`}
                </Typography>
                <Paper elevation={3} sx={{p: 2}}>
                    {isEditing ? (
                        <>
                            <TextField
                                fullWidth
                                label="Ekim Adı"
                                name="plantName"
                                value={sowing.plantName}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Arazi Adı"
                                name="landName"
                                value={sowing.landName}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Ekim Tarihi"
                                name="sowingDate"
                                type="date"
                                value={sowing.sowingDate}
                                onChange={handleChange}
                                margin="normal"
                                InputLabelProps={{shrink: true}}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>İl</InputLabel>
                                <Select
                                    name="city"
                                    value={sowing.city}
                                    onChange={handleChange}
                                >
                                    {uniqueCities.map(il => (
                                        <MenuItem key={il} value={il}>{il}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal" disabled={!sowing.city}>
                                <InputLabel>İlçe</InputLabel>
                                <Select
                                    name="district"
                                    value={sowing.district}
                                    onChange={handleChange}
                                >
                                    {ilceler.map((ilce, index) => (
                                        <MenuItem key={index} value={ilce}>{ilce}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal" disabled={!sowing.district || koyler.length === 0}>
                                <InputLabel>Köy/Mahalle</InputLabel>
                                <Select
                                    name="village"
                                    value={sowing.village || ''}
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
                            <Typography variant="h6">Arazi Adı: {sowing.landName}</Typography>
                            <Typography variant="h6">Ekim Adı: {sowing.plantName}</Typography>
                            <Typography variant="h6">Ekim Tarihi: {sowing.sowingDate}</Typography>
                            <Typography variant="h6">Şehir: {sowing.city}</Typography>
                            <Typography variant="h6">İlçe: {sowing.district}</Typography>
                            <Typography variant="h6">Köy: {sowing.village || 'N/A'}</Typography>
                        </>
                    )}
                </Paper>
                <Box sx={{marginTop: 3}}>
                    {isEditing ? (
                        <>
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Kaydet
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleEditToggle}
                                    sx={{marginLeft: 2}}>
                                İptal
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="contained" color="primary" onClick={handleEditToggle}>
                                Düzenle
                            </Button>
                            <Button variant="contained" color="error" onClick={handleOpenDeleteDialog}
                                    sx={{marginLeft: 2}}>
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
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{width: '100%'}}>
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

export default SowingDetails;
