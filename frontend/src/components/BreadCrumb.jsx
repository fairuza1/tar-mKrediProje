import React from 'react';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const BreadcrumbComponent = ({ pageName }) => {
    const navigate = useNavigate();

    const handleClick = (event, path) => {
        event.preventDefault();
        navigate(path); // Belirli bir sayfaya yönlendirme yapar
    };

    return (
        <Box
            sx={{
                marginTop: '10px',
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
                    to="/" // href yerine to kullanıyoruz çünkü React Router kullanıyoruz
                    onClick={(event) => handleClick(event, '/')}
                    style={{ fontSize: '1rem', color: 'green', fontFamily: 'Poppins, sans-serif',textDecoration:'none'}}
                >
                    Anasayfa
                </Link>

                <Typography color="text.primary" sx={{ fontSize: '1rem', color: 'green', fontFamily: 'Poppins, sans-serif' }}>
                    {pageName}
                </Typography>
            </Breadcrumbs>
        </Box>
    );
};

export default BreadcrumbComponent;