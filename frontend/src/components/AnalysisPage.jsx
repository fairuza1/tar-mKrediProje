import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AnalysisPage = () => {
    const [landData, setLandData] = useState([]);
    const [sowingData, setSowingData] = useState([]);
    const [harvestData, setHarvestData] = useState({ harvested: 0, notHarvested: 0 });
    const [selectedLand, setSelectedLand] = useState('');
    const [selectedFruit, setSelectedFruit] = useState('');
    const [fruitData, setFruitData] = useState([]);

    useEffect(() => {
        const fetchLands = async () => {
            try {
                const response = await axios.get('http://localhost:8080/lands', { withCredentials: true });
                setLandData(response.data);
            } catch (error) {
                console.error('Error fetching lands:', error);
            }
        };

        const fetchSowings = async () => {
            try {
                const response = await axios.get('http://localhost:8080/sowings', { withCredentials: true });
                setSowingData(response.data);
                calculateHarvestData(response.data);
            } catch (error) {
                console.error('Error fetching sowings:', error);
            }
        };

        const fetchHarvests = async () => {
            try {
                const response = await axios.get('http://localhost:8080/harvests', { withCredentials: true });
                return response.data.map(h => h.sowingId);
            } catch (error) {
                console.error('Error fetching harvests:', error);
                return [];
            }
        };

        const calculateHarvestData = async (sowingData) => {
            const harvestIds = await fetchHarvests();
            const harvestedCount = sowingData.filter(sowing => harvestIds.includes(sowing.id)).length;
            const notHarvestedCount = sowingData.length - harvestedCount;
            setHarvestData({ harvested: harvestedCount, notHarvested: notHarvestedCount });
        };

        fetchLands();
        fetchSowings();
    }, []);

    const handleLandChange = (event) => {
        setSelectedLand(event.target.value);
        const filteredFruits = sowingData.filter(sowing => sowing.landId === event.target.value);
        setFruitData(filteredFruits);
    };

    const handleFruitChange = (event) => {
        setSelectedFruit(event.target.value);
    };

    const groupedData = landData.reduce((acc, land) => {
        const city = land.city;
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {});

    const barData = Object.entries(groupedData).map(([name, value]) => ({ name, value }));

    const harvestPieData = [
        { name: 'Hasat Edilmiş', value: harvestData.harvested },
        { name: 'Hasat Edilmemiş', value: harvestData.notHarvested },
    ];

    const COLORS = ['#82ca9d', '#8884d8', '#ff6347', '#ffa500', '#4682b4', '#9370db', '#3cb371'];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Analizler
            </Typography>

            {/* Accordion 1: Şehir Bazında Arazi Dağılımı */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="h6">Şehir Bazında Arazi Dağılımı</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <Pie
                                data={barData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={200}
                                dataKey="value"
                            >
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </AccordionDetails>
            </Accordion>

            {/* Accordion 2: Hasat Durumu */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography variant="h6">Hasat Durumu</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={harvestPieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={150}
                                dataKey="value"
                            >
                                {harvestPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </AccordionDetails>
            </Accordion>

            {/* Arazi ve meyve seçimi */}
            <Typography variant="h6" gutterBottom>
                Arazi Seçin
            </Typography>
            <Select value={selectedLand} onChange={handleLandChange} fullWidth>
                {landData.map((land) => (
                    <MenuItem key={land.id} value={land.id}>
                        {land.name}
                    </MenuItem>
                ))}
            </Select>

            <Typography variant="h6" gutterBottom>
                Meyve Seçin
            </Typography>
            <Select value={selectedFruit} onChange={handleFruitChange} fullWidth>
                {fruitData.map((fruit) => (
                    <MenuItem key={fruit.id} value={fruit.plantName}>
                        {fruit.plantName}
                    </MenuItem>
                ))}
            </Select>

            <Typography variant="h6" gutterBottom>
                Seçilen Meyve Verileri
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fruitData.filter(fruit => fruit.plantName === selectedFruit)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </Container>
    );
};

export default AnalysisPage;
