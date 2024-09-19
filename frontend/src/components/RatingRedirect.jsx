import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const RatingRedirect = () => {
    const navigate = useNavigate();
    const { harvestId } = useParams();

    useEffect(() => {
        const fetchRedirectUrl = async () => {
            try {
                // API'den yönlendirme URL'sini al
                const response = await axios.get(`http://localhost:8080/api/ratings/redirect?harvestId=${harvestId}`);
                let url = response.data;

                // Harici URL'yi ayıkla
                const baseUrl = 'http://localhost:5173/';
                if (url.startsWith(baseUrl)) {
                    url = url.slice(baseUrl.length); // Başlangıç kısmını kaldır
                }

                // URL'nin 'http' ile başladığını kontrol et ve yönlendir
                if (url.startsWith('http')) {
                    window.location.href = url;
                } else {
                    navigate('/rating-list'); // İç URL'ye yönlendir
                }
            } catch (error) {
                console.error('Yönlendirme URL\'si alınamadı:', error);
                navigate('/rating-list'); // Hata durumunda RatingList'e yönlendir
            }
        };

        fetchRedirectUrl();
    }, [harvestId, navigate]);

    return null;
};

export default RatingRedirect;
