// // Visualization.js
// import React, { useState } from 'react';
// import mockData from '../mockPollDataNumerical.json';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { csvToJson } from "../utils/utilsCSV";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const Visualization = () => {
//   const [pollNumber, setPollNumber] = useState('1');
//   const [analysisType, setAnalysisType] = useState('topline');
//   const [toplineQuestion, setToplineQuestion] = useState('1');
//   const [crosstabBy, setCrosstabBy] = useState('1');
//   const [crosstabResults, setCrosstabResults] = useState('1');

//   const handlePollChange = (e) => setPollNumber(e.target.value);
//   const handleToplineQuestionChange = (e) => setToplineQuestion(e.target.value);
//   const handleCrosstabByChange = (e) => setCrosstabBy(e.target.value);
//   const handleCrosstabResultsChange = (e) => setCrosstabResults(e.target.value);

//   const containerStyle = { padding: '20px' };
//   const headerStyle = { fontSize: '2.5rem', marginBottom: '20px' };
//   const rowStyle = { display: 'flex', flexDirection: 'row', marginBottom: '20px' };
//   const leftColumnStyle = { flex: '0 0 30%', padding: '10px' };
//   const rightColumnStyle = { flex: '0 0 70%', padding: '10px' };
//   const boxStyle = { marginBottom: '10px', padding: '10px', border: '1px solid #000', borderRadius: '5px', textAlign: 'center' };

//   const selectStyle = {
//     marginTop: '10px',
//     padding: '5px',
//     width: '100%',
//     maxHeight: '200px', // Limits dropdown height to ensure scrolling
//     overflowY: 'auto', // Enables scrolling when there are too many options
//   };

//   const raceData = mockData.raceStatistics;
//   const labels = Object.keys(raceData);
//   const dataValues = Object.values(raceData);

//   const chartData = {
//     labels: labels,
//     datasets: [
//       {
//         label: 'Race Distribution',
//         data: dataValues,
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const customQuestions = [
//     "race",
//     "What is your opinion on climate change?",
//     "Do you support free healthcare?",
//     "Should taxes be increased for the rich?",
//     "Your favorite color?",
//     "Do you prefer coffee or tea?",
//   ];

//   return (
//     <div style={containerStyle}>
//       <h1 style={headerStyle}>Brown Opinion Project Toplines and Crosstabs</h1>

//       <div style={rowStyle}>
//         <div style={leftColumnStyle}>
//           <div style={{ ...boxStyle, backgroundColor: '#d1e7dd' }}>
//             <strong>Select Poll Number</strong>
//             <br />
//             <select value={pollNumber} onChange={handlePollChange} style={selectStyle}>
//               {Array.from({ length: 14 }, (_, index) => (
//                 <option key={index + 1} value={index + 1}>
//                   {index + 1}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={{ ...boxStyle, backgroundColor: '#f8d7da', textAlign: 'left' }}>
//             <strong>Choose analysis type:</strong>
//             <div style={{ marginTop: '10px' }}>
//               <label style={{ display: 'block', padding: '5px', cursor: 'pointer' }}>
//                 <input
//                   type="radio"
//                   name="analysis"
//                   value="topline"
//                   checked={analysisType === 'topline'}
//                   onChange={() => setAnalysisType('topline')}
//                   style={{ accentColor: 'blue', marginRight: '10px' }}
//                 />
//                 topline
//               </label>
//               <label style={{ display: 'block', padding: '5px', cursor: 'pointer' }}>
//                 <input
//                   type="radio"
//                   name="analysis"
//                   value="crosstab"
//                   checked={analysisType === 'crosstab'}
//                   onChange={() => setAnalysisType('crosstab')}
//                   style={{ accentColor: 'blue', marginRight: '10px' }}
//                 />
//                 crosstab
//               </label>
//             </div>
//           </div>

//           {analysisType === 'topline' && (
//             <div style={{ ...boxStyle, backgroundColor: '#cff4fc' }}>
//               <strong>Select question</strong>
//               <br />
//               <select value={toplineQuestion} onChange={handleToplineQuestionChange} style={selectStyle}>
//               {customQuestions.map((question, index) => (
//                 <option key={index} value={question}>
//                   {question}
//                 </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {analysisType === 'crosstab' && (
//             <>
//               <div style={{ ...boxStyle, backgroundColor: '#cff4fc' }}>
//                 <strong>Select question to crosstab by</strong>
//                 <br />
//                 <select value={crosstabBy} onChange={handleCrosstabByChange} style={selectStyle}>
//                   {Array.from({ length: 21 }, (_, index) => (
//                     <option key={index + 1} value={index + 1}>
//                       {index + 1}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div style={{ ...boxStyle, backgroundColor: '#fff3cd' }}>
//                 <strong>Select question to get results</strong>
//                 <br />
//                 <select value={crosstabResults} onChange={handleCrosstabResultsChange} style={selectStyle}>
//                   {Array.from({ length: 21 }, (_, index) => (
//                     <option key={index + 1} value={index + 1}>
//                       {index + 1}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </>
//           )}
//         </div>

//         <div style={rightColumnStyle}>
//           <div
//             style={{
//               ...boxStyle,
//               backgroundColor: '#e2e3e5',
//               width: '100%',
//               height: '400px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
//           </div>
//         </div>
//       </div>

//       <div style={{ ...boxStyle, backgroundColor: '#fefefe', width: '100%', padding: '20px' }}>
//         Table Display (Placeholder)
//       </div>
//     </div>
//   );
// };

// export default Visualization;










import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { csvToJson, getColumnProportions } from "../utils/utilsCSV"; // Import helper functions

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Visualization = () => {
  const [pollNumber, setPollNumber] = useState("1");
  const [analysisType, setAnalysisType] = useState("topline");
  const [toplineQuestion, setToplineQuestion] = useState(""); // Selected question
  const [questionOptions, setQuestionOptions] = useState([]); // Extracted column headers
  const [chartData, setChartData] = useState(null);
  const [csvString, setCsvString] = useState(null);

  // Fetch CSV data and extract column headers
  useEffect(() => {
    fetch("/mockDataCSV.csv")
      .then((response) => response.text())
      .then((csvString) => {
        setCsvString(csvString);
        
        // Convert CSV to JSON
        const jsonData = csvToJson(csvString);
        
        if (jsonData.length > 0) {
          const headers = Object.keys(jsonData[0]); // Extract column names
          setQuestionOptions(headers); // Store as dropdown options
          setToplineQuestion(headers[0]); // Set first column as default question
          updateChartData(csvString, headers[0]); // Initialize chart with default question
        }
      })
      .catch((error) => console.error("Error loading CSV:", error));
  }, []);

  const updateChartData = (csvString, question) => {
    if (!csvString) return;

    const proportions = getColumnProportions(csvString, question); // Get response proportions
    const labels = Object.keys(proportions);
    const values = Object.values(proportions).map((val) => parseFloat(val) * 100); // Convert to %

    setChartData({
      labels: labels,
      datasets: [
        {
          label: `Responses for "${question}" (%)`,
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const handleToplineQuestionChange = (e) => {
    const selectedQuestion = e.target.value;
    setToplineQuestion(selectedQuestion);
    updateChartData(csvString, selectedQuestion);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Brown Opinion Project Toplines and Crosstabs</h1>

      <div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" }}>
        <div style={{ flex: "0 0 30%", padding: "10px" }}>
          <div style={{ marginBottom: "10px", padding: "10px", border: "1px solid #000", borderRadius: "5px", textAlign: "center", backgroundColor: "#cff4fc" }}>
            <strong>Select Question</strong>
            <br />
            <select value={toplineQuestion} onChange={handleToplineQuestionChange} style={{ marginTop: "10px", padding: "5px", width: "100%" }}>
              {questionOptions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ flex: "0 0 70%", padding: "10px" }}>
          <div
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #000",
              borderRadius: "5px",
              backgroundColor: "#e2e3e5",
              width: "100%",
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {chartData ? <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} /> : <p>Loading chart...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
