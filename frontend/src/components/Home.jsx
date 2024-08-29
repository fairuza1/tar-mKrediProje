import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import BreadcrumbComponent from "./BreadCrumb";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

import card1 from '../assets/card1.jpg';
import card2 from '../assets/card2.jpg';
import card3 from '../assets/card3.jpg';
import card4 from '../assets/card4.jpg';
import card5 from '../assets/card5.jpg';
import card6 from '../assets/card6.jpg';


const pageName = "Ekim Yap"

const cards = [
    { title: '', description: '', link: '/add-land', button: 'Arazi Ekle', image: card1 },
    { title: '', description: '', button: 'Arazilerimi Görüntüle', link: '/land-list', image: card2 },
    { title: '', description: '', button: 'Ekim Yap', link: '/sowings', image: card4 },
    { title: '', description: '', button: 'Ekimlerim', link: '/sowing-list', image:card5 },
    { title: '', description: '', button: 'Hasatlarım',link: '/harvest', image: card6 },
    { title: '', button: 'Hasatları Değerlendir', link: '/rating-list', image: card3 },

];

function Home() {
    return (
        <Container>
            <Box>
                <BreadcrumbComponent pageName="Menu" />
            </Box>

            {/* Diğer içerikler */}
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