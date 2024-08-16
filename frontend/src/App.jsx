import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AddLand from './components/AddLand';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Signup from './components/Signup';
import Login from './components/Login.jsx';
import LandList from './components/LandList';
import LandDetails from './components/LandDetails';
import AddSowing from './components/AddSowing';
import SowingList from './components/SowingList'; // Burada SowingList import ediliyor
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // Yüklenme durumu

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/auth/validate-token', {
                    method: 'GET',
                    credentials: 'include',
                });
                console.log(response);
                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false); // Yüklenme durumunu güncelle
            }
        };
        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Yüklenme sırasında bir mesaj veya spinner gösterebilirsiniz
    }

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
                <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                <Route path="/add-land" element={isLoggedIn ? <AddLand /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/land-list" element={isLoggedIn ? <LandList /> : <Navigate to="/login" />} />
                <Route path="/lands/detail/:id" element={isLoggedIn ? <LandDetails /> : <Navigate to="/login" />} />
                <Route path="/sowings" element={isLoggedIn ? <AddSowing /> : <Navigate to="/login" />} />
                <Route path="/sowing-list" element={isLoggedIn ? <SowingList /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;