import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const NavbarWrapper = ({ isLoggedIn, setIsLoggedIn }) => {
    const location = useLocation(); // Mevcut rotayı alır

    // Navbar'ın gösterilmeyeceği rotalar
    const hideNavbarPaths = ['/login', '/signup'];

    return (
        !hideNavbarPaths.includes(location.pathname) && (
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        )
    );
};

export default NavbarWrapper;
