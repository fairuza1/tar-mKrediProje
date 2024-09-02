import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogout = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(900); // 15 dakika (900 saniye)
    const [warning, setWarning] = useState(false);
    const warningTimeout = useRef(null);
    const logoutTimeout = useRef(null);

    const resetTimer = () => {
        setTimeLeft(900); // Timer'ı sıfırlıyoruz (15 dakika)
        setWarning(false);
        clearTimeout(warningTimeout.current);
        clearTimeout(logoutTimeout.current);
        setupTimeouts(); // Timer'ları yeniden ayarlıyoruz
    };

    const setupTimeouts = () => {
        warningTimeout.current = setTimeout(() => {
            setWarning(true); // 10 dakika sonunda uyarıyı gösteriyoruz
        }, 600000); // 10 dakika (600000 ms)

        logoutTimeout.current = setTimeout(() => {
            navigate('/logout'); // 15 dakika sonunda kullanıcıyı logout ediyoruz
        }, 900000); // 15 dakika (900000 ms)
    };

    useEffect(() => {
        const events = ['mousemove', 'click', 'keypress'];

        const reset = () => resetTimer();

        events.forEach(event => {
            window.addEventListener(event, reset);
        });

        setupTimeouts();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, reset);
            });
            clearTimeout(warningTimeout.current);
            clearTimeout(logoutTimeout.current);
        };
    }, []);

    useEffect(() => {
        if (warning) {
            let countdown = 300; // 5 dakika (300 saniye) geri sayım
            const interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [warning]);

    return (
        <div>
            {warning && (
                <div style={{ position: 'fixed', top: 0, right: 0, padding: '1rem', background: 'red', color: 'white' }}>
                    5 dakika içinde oturumunuz kapanacak. Kalan süre: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
                </div>
            )}
        </div>
    );
};

export default AutoLogout;
