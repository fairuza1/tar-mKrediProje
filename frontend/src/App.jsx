import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AddLand from './components/AddLand';
import ViewLands from './components/ViewLands';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Contact from './components/Contact';
import Signup from './components/Signup';
import Login from './components/Login';
import LandList from './components/LandList';
import LandDetails from './components/LandDetails';
import AddSowing from './components/AddSowing';

import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get('jwtToken');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* setIsLoggedIn'i prop olarak geçiyoruz */}
            <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
                <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                <Route path="/add-land" element={isLoggedIn ? <AddLand /> : <Navigate to="/login" />} />
                <Route path="/view-lands" element={isLoggedIn ? <ViewLands /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/contact" element={isLoggedIn ? <Contact /> : <Navigate to="/login" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/land-list" element={isLoggedIn ? <LandList /> : <Navigate to="/login" />} />
                <Route path="/lands/detail/:id" element={isLoggedIn ? <LandDetails /> : <Navigate to="/login" />} />
                <Route path="/sowings" element={isLoggedIn ? <AddSowing /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
