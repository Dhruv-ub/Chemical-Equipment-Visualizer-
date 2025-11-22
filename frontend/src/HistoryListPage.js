import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function HistoryListPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { authTokens, logoutUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`${API_URL}/history/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + String(authTokens.access)
                    }
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setHistory(data);
                } else if (response.statusText === 'Unauthorized') {
                    logoutUser();
                } else {
                    console.error('Error fetching history:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [authTokens, logoutUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-2xl font-semibold text-indigo-600">Loading History...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h1 className="text-4xl font-bold text-indigo-600 mb-2">Upload History</h1>
                    <p className="text-gray-600 text-lg">Here are your recent file uploads.</p>
                </div>

                {history.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <p className="text-gray-500 text-lg">No history found. Upload a file to get started!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Items</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Pressure</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {history.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(item.upload_time).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.total_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.avg_pressure ? item.avg_pressure.toFixed(2) : 'N/A'} atm
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => navigate(`/history/${item.id}`)}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HistoryListPage;
