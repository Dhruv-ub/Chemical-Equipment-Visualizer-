import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HistorySummaryPage from './HistorySummaryPage';
// import Navbar from './Navbar'; // Import the Navbar component
// import './App.css';

function HomePage() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch('http://localhost:5000/history');
            const historyData = await response.json();
            setHistory(historyData);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            setData(result.data);
            setSummary(result.summary);
            fetchHistory();
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        }
    };

    const viewHistoryItem = (item) => {
        navigate(`/history/${item.id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
                        Chemical Data Visualizer
                    </h1>

                    <div className="flex flex-col items-center gap-4">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="block w-full max-w-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <button
                            onClick={handleUpload}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                        >
                            Upload & Analyze
                        </button>
                    </div>
                </div>

                {summary && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-sm font-semibold text-gray-600">Avg Temperature</h3>
                                <p className="text-2xl font-bold text-green-600">{summary.avgTemp}°C</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-sm font-semibold text-gray-600">Avg Pressure</h3>
                                <p className="text-2xl font-bold text-blue-600">{summary.avgPressure} atm</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-sm font-semibold text-gray-600">Avg Concentration</h3>
                                <p className="text-2xl font-bold text-purple-600">{summary.avgConc} mol/L</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-sm font-semibold text-gray-600">Max Pressure</h3>
                                <p className="text-2xl font-bold text-red-600">{summary.maxPressure} atm</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-sm font-semibold text-gray-600">Min Pressure</h3>
                                <p className="text-2xl font-bold text-orange-600">{summary.minPressure} atm</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-bold mb-4">Pressure Over Time</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="Time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="Pressure" stroke="#3b82f6" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-bold mb-4">Temperature Distribution</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="Time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Temperature" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <h2 className="text-xl font-bold p-6 border-b">Data Table</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temperature (°C)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pressure (atm)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concentration (mol/L)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.map((row, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{row.Time}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{row.Temperature}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{row.Pressure}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{row.Concentration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {history.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Recent Uploads (Last 5)</h2>
                        <ul className="space-y-2">
                            {history.map((item, index) => (
                                <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100">
                                    <span className="text-sm text-gray-700">
                                        {item.timestamp}:- {item.itemCount} items (Avg. Pressure: {item.avgPressure})
                                    </span>
                                    <button
                                        onClick={() => viewHistoryItem(item)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm font-semibold"
                                    >
                                        View
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Navbar />  {/* Should appear only ONCE here */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/history/:id" element={<HistorySummaryPage />} />
            </Routes>
        </Router>
    );
}

export default App;