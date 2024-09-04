import React, { useState, useEffect } from 'react';
import { IconButton, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ScrollToTop = () => {
    const [showScroll, setShowScroll] = useState(false);

    // Scroll event'i dinleyerek butonun görünmesini ayarlayan fonksiyon
    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 300) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 300) {
            setShowScroll(false);
        }
    };

    // Sayfa yukarı kaydırma fonksiyonu
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', checkScrollTop);
        return () => {
            window.removeEventListener('scroll', checkScrollTop);
        };
    }, [showScroll]);

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000,
                display: showScroll ? 'block' : 'none', // Görünürlük kontrolü
            }}
        >
            <IconButton
                onClick={scrollToTop}
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                }}
            >
                <ArrowUpwardIcon />
            </IconButton>
        </Box>
    );
};

export default ScrollToTop;
