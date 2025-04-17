import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const pollData = [
  { title: "November 2024", pdfUrl: "/pdfs/november-2024.pdf" },
  { title: "October 2024", pdfUrl: "/pdfs/october-2024.pdf" },
  { title: "April 2024", pdfUrl: "/pdfs/april-2024.pdf" },
  { title: "March 2024", pdfUrl: "/pdfs/march-2024.pdf" },
  { title: "November 2023", pdfUrl: "/pdfs/november-2023.pdf" },
  { title: "October 2023", pdfUrl: "/pdfs/october-2023.pdf" },
  { title: "April 2023", pdfUrl: "/pdfs/april-2023.pdf" },
  { title: "March 2023", pdfUrl: "/pdfs/march-2023.pdf" },
  { title: "November 2022", pdfUrl: "/pdfs/november-2022.pdf" },
  { title: "October 2022", pdfUrl: "/pdfs/october-2022.pdf" },
  { title: "April 2022", pdfUrl: "/pdfs/april-2022.pdf" },
  { title: "March 2022", pdfUrl: "/pdfs/march-2022.pdf" },
  { title: "November 2021", pdfUrl: "/pdfs/november-2021.pdf" },
  { title: "October 2021", pdfUrl: "/pdfs/october-2021.pdf" },
];

export default function Polls() {
  const [openYears, setOpenYears] = useState({});

  const groupedByYear = pollData.reduce((acc, poll) => {
    const year = poll.title.split(" ")[1];
    if (!acc[year]) acc[year] = [];
    acc[year].push(poll);
    return acc;
  }, {});

  const toggleYear = (year) => {
    setOpenYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const allYears = Object.keys(groupedByYear);
  const allOpen = allYears.every((year) => openYears[year]);
  const allClosed = allYears.every((year) => !openYears[year]);

  const expandAllYears = () => {
    const newState = {};
    allYears.forEach((year) => {
      newState[year] = true;
    });
    setOpenYears(newState);
  };

  const collapseAllYears = () => {
    const newState = {};
    allYears.forEach((year) => {
      newState[year] = false;
    });
    setOpenYears(newState);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Polls</h2>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={expandAllYears}
          disabled={allOpen}
          className={`px-4 py-2 rounded transition ${
            allOpen ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
        >
          Expand All
        </button>

        <button
          onClick={collapseAllYears}
          disabled={allClosed}
          className={`px-4 py-2 rounded transition ${
            allClosed ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
        >
          Collapse All
        </button>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {Object.keys(groupedByYear)
          .sort((a, b) => b - a)
          .map((year) => (
            <div key={year}>
              <button
                onClick={() => toggleYear(year)}
                className="w-full text-left text-2xl font-semibold text-black-700 hover:underline focus:outline-none mb-2 flex items-center"
              >
                <svg
                  className={`w-4 h-4 mr-2 transform transition-transform duration-200 ${
                    openYears[year] ? 'rotate-90' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                {year} Polls
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openYears[year] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="space-y-3 ml-6">
                  {groupedByYear[year].map((poll, index) => {
                    const key = poll.title.toLowerCase().replace(/\s+/g, '-') + "-poll";
                    return (
                      <Link
                        to={`/polls/${key}`}
                        key={key}
                        className="block text-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-4 border border-gray-200"
                        style={index % 2 === 0
                          ? { backgroundColor: 'rgb(179, 66, 66)' }
                          : { backgroundColor: 'rgb(50, 72, 143)' }
                        }
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-lg">{poll.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}