import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import FileUpload from '../components/FileUpload';
import DataSummary from '../components/DataSummary';
import EquipmentChart from '../components/EquipmentChart';
import DataTable from '../components/DataTable';

function HomePage() {
    const [summary, setSummary] = useState(null);
    const [rawData, setRawData] = useState([]);
    const [error, setError] = useState(null);

    // Handle a successful file upload
    const handleUploadSuccess = (data) => {
        setSummary(data.summary);
        setRawData(data.raw_data);
        setError(null);
    };

    const handleUploadError = (err) => {
        setError(err);
        setSummary(null);
        setRawData([]);
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('report-content');
        const opt = {
            margin: [0.5, 0.5],
            filename: 'chemical_analysis_report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Chemical Equipment Parameter Visualizer</h1>
            </header>
            <main>
                <div className="upload-section">
                    <FileUpload
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                    />
                    {error && <p className="error">Error: {error}</p>}
                </div>

                {summary && (
                    <div className="results-section">
                        <div className="actions-bar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <button
                                onClick={handleDownloadPDF}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                Download PDF Report
                            </button>
                        </div>

                        <div id="report-content" style={{ padding: '20px', backgroundColor: 'white' }}>
                            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Analysis Results</h2>

                            <div className="summary-and-chart" style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '40px' }}>
                                <DataSummary summary={summary} />
                                <div className="chart-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                    <EquipmentChart chartData={summary.type_distribution} />
                                </div>
                            </div>

                            <div className="table-wrapper" style={{ marginTop: '20px' }}>
                                <DataTable data={rawData} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default HomePage;
