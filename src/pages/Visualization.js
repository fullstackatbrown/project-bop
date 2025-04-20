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

export const Visualization = () => {
  // Existing UI state
  const [pollNumber, setPollNumber] = useState('1');
  const [analysisType, setAnalysisType] = useState('topline');
  // For topline, we use the CSV header questions.
  const [selectedQuestion, setSelectedQuestion] = useState('');
  // For crosstab, let the user choose two questions from the CSV header.
  const [crosstabBy, setCrosstabBy] = useState('');
  const [crosstabResults, setCrosstabResults] = useState('');

  // New state to store CSV data and headers
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);

  // State for chart data
  const [chartData, setChartData] = useState(null);

  // Handlers
  const handlePollChange = (e) => setPollNumber(e.target.value);
  const handleSelectedQuestionChange = (e) => setSelectedQuestion(e.target.value);
  const handleCrosstabByChange = (e) => setCrosstabBy(e.target.value);
  const handleCrosstabResultsChange = (e) => setCrosstabResults(e.target.value);

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

  // Load CSV data from public folder on mount
  useEffect(() => {
    Papa.parse('/mockDataCSV.csv', {
      header: true,
      download: true,
      complete: (result) => {
        // result.data is an array of objects (rows) and result.meta.fields holds the header names.
        setCsvData(result.data);
        if (result.meta && result.meta.fields) {
          // Assume the first field is "Timestamp" and skip it.
          const headers = result.meta.fields.slice(1);
          setCsvHeaders(headers);
          // Set default selected questions if not already set.
          if (headers.length > 0) {
            if (!selectedQuestion) setSelectedQuestion(headers[0]);
            if (!crosstabBy) setCrosstabBy(headers[0]);
            if (headers.length > 1 && !crosstabResults) setCrosstabResults(headers[1]);
          }
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  }, []);

  // For topline: aggregate responses for the selected question.
  useEffect(() => {
    if (analysisType !== 'topline' || !selectedQuestion || csvData.length === 0) return;
    const counts = {};
    csvData.forEach((row) => {
      const answer = row[selectedQuestion] || 'No Response';
      counts[answer] = (counts[answer] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const dataValues = Object.values(counts);
    setChartData({
      labels: labels,
      datasets: [
        {
          label: `Responses for "${selectedQuestion}"`,
          data: dataValues,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
  }, [analysisType, selectedQuestion, csvData]);

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
    // Get all unique sub-categories across groups.
    const subSet = new Set();
    groups.forEach((g) => {
      Object.keys(groupCounts[g]).forEach((sub) => subSet.add(sub));
    });
    const subCategories = Array.from(subSet).sort();
    // Create datasets: one dataset per sub-category.
    const datasets = subCategories.map((sub, idx) => {
      const totalSubs = subCategories.length;
      // Create a gradient color using HSL: fixed hue & saturation, varying lightness.
      const lightness = 30 + (idx / totalSubs) * 40; // from 30% to 70%
      const color = `hsl(200, 70%, ${lightness}%)`;
      return {
        label: sub,
        data: groups.map((g) => groupCounts[g][sub] || 0),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      };
    });
    setChartData({
      labels: groups,
      datasets: datasets,
    });
  }, [analysisType, csvData, crosstabBy, crosstabResults]);

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <div style={leftColumnStyle}>
          <div style={{ ...boxStyle, backgroundColor: '#d1e7dd' }}>
            <strong>Select Poll Number</strong>
            <br />
            <select value={pollNumber} onChange={handlePollChange} style={selectStyle}>
              {Array.from({ length: 14 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>

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

          {analysisType === 'topline' && (
            <div style={{ ...boxStyle, backgroundColor: '#cff4fc' }}>
              <strong>Select question</strong>
              <br />
              <select value={selectedQuestion} onChange={handleSelectedQuestionChange} style={selectStyle}>
                {csvHeaders.map((question, index) => (
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
                  {csvHeaders.map((question, index) => (
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
                  {csvHeaders.map((question, index) => (
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
            {analysisType === 'topline' ? (
              chartData ? (
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
              ) : (
                <p>Loading chart...</p>
              )
            ) : (
              chartData ? (
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
              ) : (
                <p>Loading chart...</p>
              )
            )}
          </div>
        </div>
      </div>

      <div style={{ ...boxStyle, backgroundColor: '#fefefe', width: '100%', padding: '20px' }}>
        Table Display (Placeholder)
      </div>
    </div>
  );
};

export default Visualization;
