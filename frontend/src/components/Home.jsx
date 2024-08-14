import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

import card1 from '../assets/card1.jpg';
import card2 from '../assets/card2.jpg';
import card3 from '../assets/card3.jpg';
import card4 from '../assets/card4.jpg';
import card5 from '../assets/card5.jpg';
const cards = [
    { title: 'Arazi Ekle', description: '', link: '/add-land', button: 'Arazi Ekle', image: card1 },
    { title: 'Arazilerim', description: '', button: 'Arazilerimi Görüntüle', link: '/land-list', image: card2 },
    { title: 'Veriminizi Degerlendiriniz', button: 'Verim Degerlendir', link: '/degerlendirme', image: card3 },
    { title: 'Ekim Yap', description: '', button: 'Ekim Yap', link: '/sowings', image: card4 },
    { title: 'Ekilen arazilerim', description:'', button: 'Ekilen Arazileri görüntüle',  link: '/sowing-list', image: card5 },
    { title: 'Card 6', description: 'Description 6', link: '/link6', image: '' },
];

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

function Home() {
    return (
        <Container>
            <Box
                sx={{
                    marginTop:'10px',
                    backgroundColor: 'rgba(0, 128, 0, 0.1)',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    marginBottom: 4,
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'Poppins, sans-serif',
                }}
            >
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/"
                        onClick={handleClick}
                        style={{ fontSize: '1rem', color: 'green', fontFamily: 'Poppins, sans-serif' }}
                    >
                        Anasayfa
                    </Link>

                    <Typography color="text.primary" sx={{ fontSize: '1rem', color: 'green', fontFamily: 'Poppins, sans-serif' }}>Menü</Typography>
                </Breadcrumbs>
            </Box>
            <Grid container spacing={4}>
                {cards.map((card, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxShadow: 3,
                                borderRadius: 2,
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={card.image}
                                alt={card.title}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {card.description}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Link to={card.link} style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            sx={{
                                                backgroundColor: 'green',
                                                color: 'white',
                                                fontFamily: 'Poppins, sans-serif',
                                                '&:hover': {
                                                    backgroundColor: 'darkgreen',
                                                },
                                            }}
                                        >
                                            {card.button}
                                        </Button>
                                    </Link>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Home;
