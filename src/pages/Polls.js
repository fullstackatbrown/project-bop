import React from 'react';
import { Link } from 'react-router-dom';

const pollData = [
  { title: "November 2024", pdfUrl: "/pdfs/november-2024.pdf" },
  { title: "October 2024", pdfUrl: "/pdfs/october-2024.pdf" },
  { title: "April 2022", pdfUrl: "/pdfs/april-2024.pdf" },
  { title: "March 2021", pdfUrl: "/pdfs/march-2024.pdf" },
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
]; // pdf links are fake!


export default function Polls() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Polls</h2>

      <div className="space-y-6 max-w-3xl mx-auto">
        {pollData.map((poll, index) => {
          const key = poll.title.toLowerCase().replace(/\s+/g, '-') + "-poll";
          return (
            <Link
              to={`/polls/${key}`}
              key={key}
              className="block text-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 border border-gray-200"
              style={index % 2 === 0
                ? { backgroundColor: 'rgb(179, 66, 66)' }
                : { backgroundColor: 'rgb(50, 72, 143)' }
              }
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{poll.title}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
