// Visualization.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Visualization = () => {
  // Hardcoded array of polls (CSV filenames with space)
  const polls = ["March 2025.csv", "November 2024.csv"];
  const [selectedPoll, setSelectedPoll] = useState(polls[0]);
  
  // Existing UI state
  const [analysisType, setAnalysisType] = useState('topline');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [crosstabBy, setCrosstabBy] = useState('');
  const [crosstabResults, setCrosstabResults] = useState('');
  
  // New state for view type: "absolute" or "percentage"
  const [viewType, setViewType] = useState("absolute");

  // New state to store CSV data and headers
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);

  // State for chart data
  const [chartData, setChartData] = useState(null);

  // Handlers
  const handlePollChange = (e) => setSelectedPoll(e.target.value);
  const handleSelectedQuestionChange = (e) => setSelectedQuestion(e.target.value);
  const handleCrosstabByChange = (e) => setCrosstabBy(e.target.value);
  const handleCrosstabResultsChange = (e) => setCrosstabResults(e.target.value);
  const handleViewTypeChange = (e) => setViewType(e.target.value);

  // Styles (unchanged)
  const containerStyle = { padding: '20px' };
  const headerStyle = { fontSize: '2.5rem', marginBottom: '20px' };
  const rowStyle = { display: 'flex', flexDirection: 'row', marginBottom: '20px' };
  const leftColumnStyle = { flex: '0 0 30%', padding: '10px' };
  const rightColumnStyle = { flex: '0 0 70%', padding: '10px' };
  const boxStyle = { marginBottom: '10px', padding: '10px', border: '1px solid #000', borderRadius: '5px', textAlign: 'center' };
  const selectStyle = {
    marginTop: '10px',
    padding: '5px',
    width: '100%',
    maxHeight: '200px',
    overflowY: 'auto',
  };

  // Load CSV data from public folder when the selected poll changes.
  useEffect(() => {
    Papa.parse(`/${selectedPoll}`, {
      header: true,
      download: true,
      complete: (result) => {
        setCsvData(result.data);
        if (result.meta && result.meta.fields) {
          const headers = result.meta.fields.slice(1); // skip Timestamp
          setCsvHeaders(headers);
          const filteredHeaders = headers.filter((h) => !h.startsWith("Column"));
          if (filteredHeaders.length > 0) {
            if (!selectedQuestion) setSelectedQuestion(filteredHeaders[0]);
            if (!crosstabBy) setCrosstabBy(filteredHeaders[0]);
            if (filteredHeaders.length > 1 && !crosstabResults) setCrosstabResults(filteredHeaders[1]);
          }
        }
      },
      error: (error) => { console.error('Error parsing CSV:', error); },
    });
  }, [selectedPoll]);

  // For topline: aggregate responses for the selected question.
  useEffect(() => {
    if (analysisType !== 'topline' || !selectedQuestion || csvData.length === 0) return;
    const counts = {};
    csvData.forEach((row) => {
      const answer = row[selectedQuestion] || 'No Response';
      counts[answer] = (counts[answer] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const absoluteValues = Object.values(counts);
    const total = absoluteValues.reduce((sum, v) => sum + v, 0);
    const dataValues = viewType === "percentage"
      ? absoluteValues.map((count) => total ? ((count / total) * 100).toFixed(2) : 0)
      : absoluteValues;
    setChartData({
      labels: labels,
      datasets: [
        {
          label: viewType === "percentage"
            ? `Responses for "${selectedQuestion}" (%)`
            : `Responses for "${selectedQuestion}"`,
          data: dataValues,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
  }, [analysisType, selectedQuestion, csvData, viewType]);

  // For crosstab: aggregate data based on the two selected questions.
  useEffect(() => {
    if (analysisType !== 'crosstab' || !crosstabBy || !crosstabResults || csvData.length === 0) return;
    const groupCounts = {}; // { groupValue: { subValue: count } }
    csvData.forEach((row) => {
      const group = row[crosstabBy] || 'No Response';
      const sub = row[crosstabResults] || 'No Response';
      if (!groupCounts[group]) groupCounts[group] = {};
      groupCounts[group][sub] = (groupCounts[group][sub] || 0) + 1;
    });
    const groups = Object.keys(groupCounts).sort();
    const subSet = new Set();
    groups.forEach((g) => { Object.keys(groupCounts[g]).forEach((sub) => subSet.add(sub)); });
    const subCategories = Array.from(subSet).sort();
    // Create datasets: one per sub-category.
    const datasets = subCategories.map((sub, idx) => {
      const totalSubs = subCategories.length;
      const lightness = 30 + (idx / totalSubs) * 40; // from 30% to 70%
      const color = `hsl(200, 70%, ${lightness}%)`;
      // For each group (row), get the count.
      const absoluteData = groups.map((g) => groupCounts[g][sub] || 0);
      // If percentage view, convert count to percentage of group total.
      const data = viewType === "percentage"
        ? groups.map((g, i) => {
            const groupTotal = Object.values(groupCounts[g]).reduce((sum, val) => sum + val, 0);
            return groupTotal ? ((groupCounts[g][sub] || 0) / groupTotal * 100).toFixed(2) : 0;
          })
        : absoluteData;
      return {
        label: sub,
        data: data,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      };
    });
    setChartData({
      labels: groups,
      datasets: datasets,
    });
  }, [analysisType, csvData, crosstabBy, crosstabResults, viewType]);

  // Function to render the table.
  const renderTable = () => {
    if (!chartData) return null;
    if (analysisType === 'topline') {
      const absoluteValues = chartData.datasets[0].data.map(Number);
      const total = absoluteValues.reduce((sum, value) => sum + value, 0);
      if (viewType === "absolute") {
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '5px' }}>Answer</th>
                <th style={{ border: '1px solid black', padding: '5px' }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {chartData.labels.map((answer, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{answer}</td>
                  <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>{absoluteValues[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else {
        // Percentage view for topline
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '5px' }}>Answer</th>
                <th style={{ border: '1px solid black', padding: '5px' }}>Percentage (%)</th>
              </tr>
            </thead>
            <tbody>
              {chartData.labels.map((answer, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{answer}</td>
                  <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>
                    { total ? Number(chartData.datasets[0].data[i]) : 0 }%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
    } else if (analysisType === 'crosstab') {
      const groups = chartData.labels;
      const subCategories = chartData.datasets.map((ds) => ds.label);
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}></th>
              {subCategories.map((sub, j) => (
                <th key={j} style={{ border: '1px solid black', padding: '5px' }}>{sub}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group, i) => {
              // For each group, compute total if in absolute mode
              let groupTotal = 0;
              if (viewType === "absolute") {
                chartData.datasets.forEach((ds) => {
                  groupTotal += Number(ds.data[i]);
                });
              }
              return (
                <tr key={i}>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{group}</td>
                  {chartData.datasets.map((ds, j) => {
                    const value = ds.data[i];
                    return (
                      <td key={j} style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>
                        {viewType === "absolute" ? value : `${value}%`}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    return null;
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Brown Opinion Project Toplines and Crosstabs</h1>

      <div style={rowStyle}>
        <div style={leftColumnStyle}>
          {/* Poll selector */}
          <div style={{ ...boxStyle, backgroundColor: '#d1e7dd' }}>
            <strong>Select Poll</strong>
            <br />
            <select value={selectedPoll} onChange={handlePollChange} style={selectStyle}>
              {polls.map((poll, index) => (
                <option key={index} value={poll}>
                  {poll.replace('.csv', '')}
                </option>
              ))}
            </select>
          </div>

          {/* Analysis type selector */}
          <div style={{ ...boxStyle, backgroundColor: '#f8d7da', textAlign: 'left' }}>
            <strong>Choose analysis type:</strong>
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', padding: '5px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="analysis"
                  value="topline"
                  checked={analysisType === 'topline'}
                  onChange={() => setAnalysisType('topline')}
                  style={{ accentColor: 'blue', marginRight: '10px' }}
                />
                topline
              </label>
              <label style={{ display: 'block', padding: '5px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="analysis"
                  value="crosstab"
                  checked={analysisType === 'crosstab'}
                  onChange={() => setAnalysisType('crosstab')}
                  style={{ accentColor: 'blue', marginRight: '10px' }}
                />
                crosstab
              </label>
            </div>
          </div>

          {/* New View type selector */}
          <div style={{ ...boxStyle, backgroundColor: '#e0e0e0', textAlign: 'left' }}>
            <strong>Choose view type:</strong>
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'inline-block', padding: '5px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="viewType"
                  value="absolute"
                  checked={viewType === 'absolute'}
                  onChange={handleViewTypeChange}
                  style={{ accentColor: 'blue', marginRight: '5px' }}
                />
                Absolute
              </label>
              <label style={{ display: 'inline-block', padding: '5px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="viewType"
                  value="percentage"
                  checked={viewType === 'percentage'}
                  onChange={handleViewTypeChange}
                  style={{ accentColor: 'blue', marginRight: '5px' }}
                />
                Percentage
              </label>
            </div>
          </div>

          {analysisType === 'topline' && (
            <div style={{ ...boxStyle, backgroundColor: '#cff4fc' }}>
              <strong>Select question</strong>
              <br />
              <select value={selectedQuestion} onChange={handleSelectedQuestionChange} style={selectStyle}>
                {csvHeaders
                  .filter((question) => !question.startsWith("Column"))
                  .map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                ))}
              </select>
            </div>
          )}

          {analysisType === 'crosstab' && (
            <>
              <div style={{ ...boxStyle, backgroundColor: '#cff4fc' }}>
                <strong>Select question to crosstab by</strong>
                <br />
                <select value={crosstabBy} onChange={handleCrosstabByChange} style={selectStyle}>
                  {csvHeaders
                    .filter((question) => !question.startsWith("Column"))
                    .map((question, index) => (
                      <option key={index} value={question}>
                        {question}
                      </option>
                  ))}
                </select>
              </div>
              <div style={{ ...boxStyle, backgroundColor: '#fff3cd' }}>
                <strong>Select question to get results</strong>
                <br />
                <select value={crosstabResults} onChange={handleCrosstabResultsChange} style={selectStyle}>
                  {csvHeaders
                    .filter((question) => !question.startsWith("Column"))
                    .map((question, index) => (
                      <option key={index} value={question}>
                        {question}
                      </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div style={rightColumnStyle}>
          <div
            style={{
              ...boxStyle,
              backgroundColor: '#e2e3e5',
              width: '100%',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {chartData ? (
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
        </div>
      </div>

      {/* Table Display */}
      <div style={{ ...boxStyle, backgroundColor: '#fefefe', width: '100%', padding: '20px' }}>
        {renderTable()}
      </div>
    </div>
  );
};

export default Visualization;