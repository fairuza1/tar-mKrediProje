import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarWrapper from './components/NavbarWrapper';
import Home from './components/Home';
import AddLand from './components/AddLand';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Signup from './components/Signup';
import Login from './components/Login.jsx';
import LandList from './components/LandList';
import LandDetails from './components/LandDetails';
import AddSowing from './components/AddSowing';
import SowingList from './components/SowingList';
import SowingDetails from './components/SowingDetails.jsx';
import Harvest from './components/Harvest.jsx';
import Rating from './components/Rating.jsx';
import RatingList from './components/RatingList.jsx';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/auth/validate-token', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <NavbarWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
                <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                <Route path="/add-land" element={isLoggedIn ? <AddLand /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/land-list" element={isLoggedIn ? <LandList /> : <Navigate to="/login" />} />
                <Route path="/lands/detail/:id" element={isLoggedIn ? <LandDetails /> : <Navigate to="/login" />} />
                <Route path="/sowings" element={isLoggedIn ? <AddSowing /> : <Navigate to="/login" />} />
                <Route path="/sowing-list" element={isLoggedIn ? <SowingList /> : <Navigate to="/login" />} />
                <Route path="/sowings/detail/:id" element={isLoggedIn ? <SowingDetails /> : <Navigate to="/login" />} />
                <Route path="/harvest" element={isLoggedIn ? <Harvest /> : <Navigate to="/login" />} />
                <Route path="/rating/:harvestId" element={isLoggedIn ? <Rating /> : <Navigate to="/login" />} />
                <Route path="/rating-list" element={isLoggedIn ? <RatingList /> : <Navigate to="/login" />} />

                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            </Routes>
        </Router>
    );
}

export default App;
