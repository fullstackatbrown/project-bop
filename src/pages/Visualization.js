// Visualization.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import "./Visualization.css";
import { queryObjects } from '../cosmic';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const Visualization = () => {
  // Hardcoded array of polls (CSV filenames with space)
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState("");

  useEffect(() => {
    (async () => {
      const recvPolls = (await queryObjects({ type: "poll-groups" })).map(raw => raw.title);
      setPolls(recvPolls);
      setSelectedPoll(recvPolls[0]);
    })();
  }, []);

  // UI state
  const [analysisType, setAnalysisType] = useState('topline');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [crosstabBy, setCrosstabBy] = useState('');
  const [crosstabResults, setCrosstabResults] = useState('');
  const [viewType, setViewType] = useState('absolute');

  // CSV data
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);

  // Chart data
  const [chartData, setChartData] = useState(null);

  // Handlers
  const handlePollChange            = e => setSelectedPoll(e.target.value);
  const handleAnalysisChange        = e => setAnalysisType(e.target.value);
  const handleViewTypeChange        = e => setViewType(e.target.value);
  const handleQuestionChange        = e => setSelectedQuestion(e.target.value);
  const handleCrosstabByChange      = e => setCrosstabBy(e.target.value);
  const handleCrosstabResultsChange = e => setCrosstabResults(e.target.value);

  // Styles
  const containerStyle     = { padding: '20px', className: "visualizer-main" };
  const headerStyle        = { fontSize: '2.5rem', marginBottom: '20px' };
  const rowStyle           = { display: 'flex', flexDirection: 'row', marginBottom: '20px' };
  const leftColumnStyle    = { flex: '0 0 30%', padding: '10px' };
  const rightColumnStyle   = { flex: '0 0 70%', padding: '10px' };
  const boxStyle           = { marginBottom: '10px', padding: '10px', border: '1px solid #000', borderRadius: '5px', textAlign: 'center' };
  const selectStyle        = { marginTop: '10px', padding: '5px', width: '100%', maxHeight: '200px', overflowY: 'auto' };

  // Load CSV when poll changes
  useEffect(() => {
    (async () => {
      const pollCSV = (await queryObjects({ type: "poll-groups", slug: selectedPoll.toLowerCase().split(" ").join("-") }))[0].metadata.csv_data;
      const { data, meta } = Papa.parse(pollCSV, { header: true });
      setCsvData(data);
      if (meta && meta.fields) {
        const headers = meta.fields.slice(1).filter(h => !h.startsWith('Column'));
        setCsvHeaders(headers);
        if (headers.length) {
          setSelectedQuestion(prev => prev || headers[0]);
          setCrosstabBy(prev => prev || headers[0]);
          setCrosstabResults(prev => prev || headers[1] || headers[0]);
        }
      }
    })();
  }, [selectedPoll]);

  // Build topline chart data
  useEffect(() => {
    if (analysisType !== 'topline' || !selectedQuestion || !csvData.length) return;
    const counts = {};
    csvData.forEach(row => {
      const ans = row[selectedQuestion] || 'No Response';
      counts[ans] = (counts[ans] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const absValues = Object.values(counts);
    const total = absValues.reduce((s, v) => s + v, 0);
    const dataValues = viewType === 'percentage'
      ? absValues.map(v => total ? +(v / total * 100).toFixed(2) : 0)
      : absValues;

    setChartData({
      labels,
      datasets: [{
        label: '', // no legend for topline
        data: dataValues,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor:   'rgba(75,192,192,1)',
        borderWidth: 1,
      }]
    });
  }, [analysisType, selectedQuestion, csvData, viewType]);

  // Build crosstab chart data
  useEffect(() => {
    if (analysisType !== 'crosstab' || !crosstabBy || !crosstabResults || !csvData.length) return;
    const counts = {};
    csvData.forEach(row => {
      const g = row[crosstabBy] || 'No Response';
      const s = row[crosstabResults] || 'No Response';
      counts[g] = counts[g] || {};
      counts[g][s] = (counts[g][s] || 0) + 1;
    });
    const groups = Object.keys(counts).sort();
    const subCats = Array.from(new Set(groups.flatMap(g => Object.keys(counts[g])))).sort();

    const datasets = subCats.map((sub, idx) => {
      const totalSubs = subCats.length;
      const hue = (270 + (idx / (totalSubs - 1)) * 150) % 360;
      const color = `hsl(${hue},70%,50%)`;
      const abs = groups.map(g => counts[g][sub] || 0);
      const dataValues = viewType === 'percentage'
        ? groups.map(g => {
            const sum = Object.values(counts[g]).reduce((a,b) => a + b, 0);
            return sum ? +(counts[g][sub] / sum * 100).toFixed(2) : 0;
          })
        : abs;

      return {
        label: sub,
        data: dataValues,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1
      };
    });

    setChartData({ labels: groups, datasets });
  }, [analysisType, csvData, crosstabBy, crosstabResults, viewType]);

  // Render table
  const renderTable = () => {
    if (!chartData) return null;

    if (analysisType === 'topline') {
      const abs = chartData.datasets[0].data.map(Number);
      const total = abs.reduce((s, v) => s + v, 0);
      return (
        <table style={{ width:'100%', borderCollapse:'collapse', marginTop:10 }}>
          <thead>
            <tr>
              <th style={{border:'1px solid black',padding:5}}>Answer</th>
              <th style={{border:'1px solid black',padding:5}}>
                {viewType==='percentage' ? 'Percentage (%)' : 'Count'}
              </th>
            </tr>
          </thead>
          <tbody>
            {chartData.labels.map((ans,i) => (
              <tr key={i}>
                <td style={{border:'1px solid black',padding:5}}>{ans}</td>
                <td style={{border:'1px solid black',padding:5,textAlign:'right'}}>
                  {viewType==='percentage'
                    ? `${isNaN(chartData.datasets[0].data[i]) ? 0 : chartData.datasets[0].data[i]}%`
                    : abs[i]
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      const groups = chartData.labels;
      const subs = chartData.datasets.map(ds => ds.label);
      return (
        <table style={{ width:'100%', borderCollapse:'collapse', marginTop:10 }}>
          <thead>
            <tr>
              <th style={{border:'1px solid black',padding:5}}></th>
              {subs.map((sub,i) => (
                <th key={i} style={{border:'1px solid black',padding:5}}>{sub}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g,gi) => (
              <tr key={gi}>
                <td style={{border:'1px solid black',padding:5}}>{g}</td>
                {chartData.datasets.map((ds,di) => (
                  <td key={di} style={{border:'1px solid black',padding:5,textAlign:'right'}}>
                    {viewType==='percentage'
                      ? `${isNaN(ds.data[gi]) ? 0 : ds.data[gi]}%`
                      : ds.data[gi]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <>
      <p className='visualizer-mobile-msg'>Sorry, the visualizer is only accessible on desktop.</p>
      <div style={containerStyle} className='visualizer-main'>
        <div style={rowStyle}>
          <div style={leftColumnStyle}>
            <div style={{ ...boxStyle, backgroundColor: '#d1e7dd' }}>
              <strong>Select Poll</strong><br/>
              <select value={selectedPoll} onChange={handlePollChange} style={selectStyle}>
                {polls.map((p,i) => (
                  <option key={i} value={p}>{p.replace('.csv','')}</option>
                ))}
              </select>
            </div>

            <div style={{ ...boxStyle, backgroundColor: '#f8d7da', textAlign: 'left' }}>
              <strong>Choose analysis type:</strong>
              <div style={{ marginTop: 10 }}>
                <label style={{ display: 'block', cursor: 'pointer', padding: 5 }}>
                  <input
                    type="radio"
                    name="analysis"
                    value="topline"
                    checked={analysisType==='topline'}
                    onChange={handleAnalysisChange}
                    style={{ accentColor: 'blue', marginRight: 10 }}
                  />
                  topline
                </label>
                <label style={{ display: 'block', cursor: 'pointer', padding: 5 }}>
                  <input
                    type="radio"
                    name="analysis"
                    value="crosstab"
                    checked={analysisType==='crosstab'}
                    onChange={handleAnalysisChange}
                    style={{ accentColor: 'blue', marginRight: 10 }}
                  />
                  crosstab
                </label>
              </div>
            </div>

            <div style={{ ...boxStyle, backgroundColor: '#e0e0e0', textAlign: 'left' }}>
              <strong>Choose view type:</strong>
              <div style={{ marginTop: 10 }}>
                <label style={{ display: 'inline-block', cursor: 'pointer', padding: 5 }}>
                  <input
                    type="radio"
                    name="viewType"
                    value="absolute"
                    checked={viewType==='absolute'}
                    onChange={handleViewTypeChange}
                    style={{ accentColor: 'blue', marginRight: 5 }}
                  />
                  Absolute
                </label>
                <label style={{ display: 'inline-block', cursor: 'pointer', padding: 5 }}>
                  <input
                    type="radio"
                    name="viewType"
                    value="percentage"
                    checked={viewType==='percentage'}
                    onChange={handleViewTypeChange}
                    style={{ accentColor: 'blue', marginRight: 5 }}
                  />
                  Percentage
                </label>
              </div>
            </div>

            {analysisType==='topline' && (
              <div style={{ ...boxStyle, backgroundColor: '#cff4fc' }}>
                <strong>Select question</strong><br/>
                <select value={selectedQuestion} onChange={handleQuestionChange} style={selectStyle}>
                  {csvHeaders.map((q,i) => (
                    <option key={i} value={q}>{q}</option>
                  ))}
                </select>
              </div>
            )}

            {analysisType==='crosstab' && (
              <>
                <div style={{ ...boxStyle, backgroundColor: '#cff4fc' }}>
                  <strong>Select question to crosstab by</strong><br/>
                  <select value={crosstabBy} onChange={handleCrosstabByChange} style={selectStyle}>
                    {csvHeaders.map((q,i) => (
                      <option key={i} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
                <div style={{ ...boxStyle, backgroundColor: '#fff3cd' }}>
                  <strong>Select question to get results</strong><br/>
                  <select value={crosstabResults} onChange={handleCrosstabResultsChange} style={selectStyle}>
                    {csvHeaders.map((q,i) => (
                      <option key={i} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div style={rightColumnStyle}>
            <div style={{
              ...boxStyle,
              backgroundColor: '#e2e3e5',
              width: '100%', height: analysisType == "topline" ? 425 : 525,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {chartData ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: analysisType==='crosstab',
                        position: 'top'
                      },
                      title: {
                        display: analysisType==='crosstab',
                        text: `Responses by "${crosstabResults}"`,
                        font: { size: 16 },
                        padding: { bottom: 20 }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: analysisType==='topline'
                            ? selectedQuestion
                            : crosstabBy,
                          font: { size: 14 }
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: viewType==='percentage' ? 'Percentage (%)' : 'Count',
                          font: { size: 14 }
                        },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ ...boxStyle, backgroundColor: '#fefefe', width: '100%', padding: 20, overflowX: "scroll" }}>
          {renderTable()}
        </div>
      </div>
    </>
  );
};

export default Visualization;
