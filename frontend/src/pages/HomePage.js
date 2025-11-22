import React, { useState } from 'react';
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
                        <h2>Analysis Results</h2>
                        <div className="summary-and-chart">
                            <DataSummary summary={summary} />
                            <EquipmentChart chartData={summary.type_distribution} />
                        </div>
                        <DataTable data={rawData} />
                    </div>
                )}
            </main>
        </div>
    );
}

export default HomePage;
