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
    const [selectedCity, setSelectedCity] = useState('');

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
        setSelectedFruit('');  // Meyve seçimini sıfırlıyoruz
    };

    const handleFruitChange = (event) => {
        setSelectedFruit(event.target.value);
    };

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    // Benzersiz bitki isimlerini filtreleme
    const uniqueFruits = [...new Map(fruitData.map(item => [item['plantName'], item])).values()];

    const groupedDataByCity = landData.reduce((acc, land) => {
        const city = land.city;
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {});

    const groupedDataByDistrict = landData
        .filter(land => land.city === selectedCity)
        .reduce((acc, land) => {
            const district = land.district;
            acc[district] = (acc[district] || 0) + 1;
            return acc;
        }, {});

    const cityData = Object.entries(groupedDataByCity).map(([name, value]) => ({ name, value }));
    const districtData = Object.entries(groupedDataByDistrict).map(([name, value]) => ({ name, value }));

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
                                data={cityData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={200}
                                dataKey="value"
                            >
                                {cityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </AccordionDetails>
            </Accordion>

            {/* Accordion 2: İlçe Bazında Arazi Dağılımı */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography variant="h6">İlçe Bazında Arazi Dağılımı</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="h6" gutterBottom>
                        Şehir Seçin
                    </Typography>
                    <Select value={selectedCity} onChange={handleCityChange} fullWidth>
                        {Object.keys(groupedDataByCity).map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>

                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <Pie
                                data={districtData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={200}
                                dataKey="value"
                            >
                                {districtData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </AccordionDetails>
            </Accordion>

            {/* Accordion 3: Hasat Durumu */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
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

            {/* Eğer bir arazi seçilmediyse meyve seçimi ve grafik gösterilmez */}
            {selectedLand && (
                <>
                    <Typography variant="h6" gutterBottom>
                        Meyve Seçin
                    </Typography>
                    <Select value={selectedFruit} onChange={handleFruitChange} fullWidth>
                        {uniqueFruits.map((sowing) => (
                            <MenuItem key={sowing.id} value={sowing.plantName}>
                                {sowing.plantName}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Meyve analizi ve grafikler */}
                    {selectedFruit && (
                        <ResponsiveContainer width="100%" height={500}>
                            <LineChart
                                data={fruitData.filter(sowing => sowing.plantName === selectedFruit)}
                                margin={{
                                    top: 5, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="sowingDate" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </>
            )}
        </Container>
    );
};

export default AnalysisPage;
