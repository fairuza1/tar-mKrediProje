import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AnalysisPage from './components/AnalysisPage.jsx'
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/auth/validate-token', {
                    method: 'GET',
                    credentials: 'include', // JWT'yi içeren cookie'yi gönderir
                });
                const result = await response.json();

                if (response.ok && result.isValid) {
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
            <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </Router>
    );
}

function AppContent({ isLoggedIn, setIsLoggedIn }) {
    const location = useLocation();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div className={isAuthPage ? '' : 'app-container'}>
            <NavbarWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="main-content">
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
                    <Route path="/analyzes" element={isLoggedIn ? <AnalysisPage /> : <Navigate to="/login" />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
