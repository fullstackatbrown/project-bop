// Visualization.js
import React, { useState } from 'react';

const Visualization = () => {
  const [pollNumber, setPollNumber] = useState('1');
  const [analysisType, setAnalysisType] = useState('topline');
  const [toplineQuestion, setToplineQuestion] = useState('1');
  const [crosstabBy, setCrosstabBy] = useState('1');
  const [crosstabResults, setCrosstabResults] = useState('1');

  const handlePollChange = (e) => setPollNumber(e.target.value);
  const handleToplineQuestionChange = (e) => setToplineQuestion(e.target.value);
  const handleCrosstabByChange = (e) => setCrosstabBy(e.target.value);
  const handleCrosstabResultsChange = (e) => setCrosstabResults(e.target.value);

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
    maxHeight: '200px', // Limits dropdown height to ensure scrolling
    overflowY: 'auto', // Enables scrolling when there are too many options
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Brown Opinion Project Toplines and Crosstabs</h1>

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
              <select value={toplineQuestion} onChange={handleToplineQuestionChange} style={selectStyle}>
                {Array.from({ length: 20 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
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
                  {Array.from({ length: 21 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ ...boxStyle, backgroundColor: '#fff3cd' }}>
                <strong>Select question to get results</strong>
                <br />
                <select value={crosstabResults} onChange={handleCrosstabResultsChange} style={selectStyle}>
                  {Array.from({ length: 21 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
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
            Plot Area (Placeholder)
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
