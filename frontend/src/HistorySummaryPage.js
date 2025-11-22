import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import AuthContext from './context/AuthContext';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function HistorySummaryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Add normalized table state
    const [headers, setHeaders] = useState([]);
    const [tableRows, setTableRows] = useState([]);

    useEffect(() => {
        const fetchHistoryDetail = async () => {
            // try {
            //     const response = await fetch(`http://localhost:8000/api/history/${id}/`, {
            //         method: 'GET',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': 'Bearer ' + String(authTokens.access)
            //         }
            //     });


                try {
    // 2. Use the variable instead of localhost
                    const response = await fetch(`${API_URL}/history/${id}/`, { 
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(authTokens.access)
             
            
            // 3. Only include this IF you actually set up JWT on the backend. 
            // If not, comment this line out for now to get the deployment working.
            // 'Authorization': 'Bearer ' + String(authTokens.access) 
        }
    });


                if (response.status === 200) {
                    const data = await response.json();
                    console.log('Received history data:', data);
                    setHistoryData(data);
                } else if (response.statusText === 'Unauthorized') {
                    logoutUser();
                } else {
                    console.error('Error fetching history:', response.statusText);
                    setHistoryData(null);
                }
            } catch (error) {
                console.error('Error fetching history:', error);
                setHistoryData(null);
            } finally {
                setLoading(false);
            }
        };

        if (authTokens) {
            fetchHistoryDetail();
        } else {
            setLoading(false);
        }
    }, [id, authTokens, logoutUser]);

    // CSV parser (handles quotes, commas, newlines)
    const parseCSV = (text) => {
        const rows = [];
        let cur = '';
        let row = [];
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            const next = text[i + 1];

            if (ch === '"') {
                if (inQuotes && next === '"') {
                    cur += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === ',' && !inQuotes) {
                row.push(cur);
                cur = '';
            } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
                if (cur !== '' || row.length) {
                    row.push(cur);
                    rows.push(row);
                    row = [];
                    cur = '';
                }
                // normalize CRLF
                if (ch === '\r' && next === '\n') i++;
            } else {
                cur += ch;
            }
        }
        if (cur !== '' || row.length) {
            row.push(cur);
            rows.push(row);
        }

        const hdr = rows.length ? rows[0].map((h, i) => (h === '' ? `Col ${i + 1}` : String(h))) : [];
        const body = rows.length > 1 ? rows.slice(1) : [];
        return { headers: hdr, rows: body };
    };

    // Normalize any CSV/table shape into headers + rows
    useEffect(() => {
        let cancelled = false;
        const setSafe = (h, r) => {
            if (!cancelled) {
                setHeaders(h);
                setTableRows(r);
            }
        };

        const detectAndSet = async () => {
            if (!historyData) {
                setSafe([], []);
                return;
            }

            // pandas split-orient: { columns: [], data: [[]] }
            if (Array.isArray(historyData.columns) && Array.isArray(historyData.data)) {
                setSafe(historyData.columns, historyData.data);
                return;
            }

            // Array candidates (objects or arrays)
            const arrayKeys = ['raw_data', 'rawData', 'data', 'rows', 'excel_data', 'excel', 'sheet', 'sheet_data', 'values', 'records', 'table', 'table_rows'];
            for (const k of arrayKeys) {
                const v = historyData[k];
                if (Array.isArray(v) && v.length) {
                    if (Array.isArray(v[0])) {
                        const first = v[0];
                        const allSimple = first.every(c => typeof c === 'string' || typeof c === 'number' || c == null);
                        const hdr = allSimple ? first.map((h, i) => (h === '' || h == null) ? `Col ${i + 1}` : String(h))
                            : first.map((_, i) => `Col ${i + 1}`);
                        const body = allSimple ? v.slice(1) : v;
                        setSafe(hdr, body);
                        return;
                    } else if (typeof v[0] === 'object') {
                        const keySet = new Set();
                        v.forEach(r => Object.keys(r).forEach(x => keySet.add(x)));
                        const hdr = [...keySet];
                        const body = v.map(r => hdr.map(h => r[h] ?? ''));
                        setSafe(hdr, body);
                        return;
                    }
                }
            }

            // CSV text candidates
            const textKeys = ['csv', 'csv_text', 'csv_content', 'raw_csv', 'text', 'content'];
            for (const k of textKeys) {
                const t = historyData[k];
                if (typeof t === 'string' && t.trim()) {
                    const { headers: h, rows: r } = parseCSV(t);
                    setSafe(h, r);
                    return;
                }
            }

            // Remote CSV URL candidates
            const urlKeys = ['file_url', 'csv_url', 'file', 'uploaded_file', 'url'];
            for (const k of urlKeys) {
                const url = historyData[k];
                if (typeof url === 'string' && url) {
                    try {
                        const res = await fetch(url);
                        if (res.ok) {
                            const txt = await res.text();
                            const { headers: h, rows: r } = parseCSV(txt);
                            setSafe(h, r);
                            return;
                        }
                    } catch (_) { /* ignore */ }
                }
            }

            setSafe([], []);
        };

        detectAndSet();
        return () => { cancelled = true; };
    }, [historyData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
                <div className="text-2xl font-semibold text-slate-700">Loading...</div>
            </div>
        );
    }

    if (!historyData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
                <div className="text-2xl font-semibold text-red-600 mb-4">History not found</div>
                <button
                    onClick={() => navigate('/history')}
                    className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                    Back to History
                </button>
            </div>
        );
    }

    // Prepare chart data from summary
    const chartData = historyData.type_distribution
        ? Object.entries(historyData.type_distribution).map(([name, value]) => ({
            name,
            value
        }))
        : [];

    const COLORS = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3', '#C7CEEA', '#FFA07A'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/history')}
                    className="mb-6 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 font-semibold transition-colors shadow-md"
                >
                    ← Back to History
                </button>

                <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl shadow-2xl p-12 mb-12 text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">Historical Analysis</h1>
                    <p className="text-slate-300 text-xl">
                        Uploaded on: {new Date(historyData.upload_time).toLocaleString()}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-10 mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 mb-10 border-b-2 border-slate-200 pb-4 text-center">
                        Data Summary
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-sm font-semibold text-blue-700 uppercase mb-3 tracking-wide">Total Equipment</h3>
                            <p className="text-5xl font-bold text-blue-900">{historyData.total_count || 0}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-sm font-semibold text-green-700 uppercase mb-3 tracking-wide">Avg. Flowrate</h3>
                            <p className="text-5xl font-bold text-green-900">
                                {historyData.avg_flowrate?.toFixed(2) || 'N/A'}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-sm font-semibold text-purple-700 uppercase mb-3 tracking-wide">Avg. Pressure</h3>
                            <p className="text-5xl font-bold text-purple-900">
                                {historyData.avg_pressure?.toFixed(2) || 'N/A'}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-sm font-semibold text-orange-700 uppercase mb-3 tracking-wide">Avg. Temperature</h3>
                            <p className="text-5xl font-bold text-orange-900">
                                {historyData.avg_temperature?.toFixed(2) || 'N/A'} °C
                            </p>
                        </div>
                    </div>
                </div>

                {chartData.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b-2 border-slate-200 pb-3 text-center">
                            Equipment Type Distribution
                        </h2>
                        <div className="flex justify-center items-center">
                            <ResponsiveContainer width="100%" height={450}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={160}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 text-center">
                        <h2 className="text-2xl font-bold text-white">Uploaded CSV Data</h2>
                    </div>
                    <div className="overflow-x-auto">
                        {tableRows.length ? (
                            <table className="min-w-full">
                                <thead className="bg-slate-100">
                                    <tr>
                                        {headers.map(h => (
                                            <th
                                                key={h}
                                                className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {tableRows.map((row, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                                            {Array.isArray(row)
                                                ? row.map((cell, cIdx) => (
                                                    <td key={cIdx} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                                        {cell ?? ''}
                                                    </td>
                                                ))
                                                : headers.map(h => (
                                                    <td key={h} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                                        {row[h] ?? ''}
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-6 text-slate-600 text-sm">
                                No CSV data available. Keys: {Object.keys(historyData).join(', ')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistorySummaryPage;
