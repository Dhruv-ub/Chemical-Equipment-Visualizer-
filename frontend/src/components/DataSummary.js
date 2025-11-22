// src/components/DataSummary.js
import React from 'react';

function DataSummary({ summary }) {
  return (
    <div className="summary-cards">
      <h3>Data Summary</h3>
      <div className="card">
        <strong>Total Equipment:</strong> {summary.total_count}
      </div>
      <div className="card">
        <strong>Avg. Flowrate:</strong> {summary.avg_flowrate.toFixed(2)}
      </div>
      <div className="card">
        <strong>Avg. Pressure:</strong> {summary.avg_pressure.toFixed(2)}
      </div>
      <div className="card">
        <strong>Avg. Temperature:</strong> {summary.avg_temperature.toFixed(2)} °C
      </div>
    </div>
  );
}

export default DataSummary;