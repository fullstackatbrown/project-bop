import React from 'react';
import { Link } from 'react-router-dom';


const pollData = [
  { id: 1, title: "November 2024", pdfUrl: "/pdfs/november2024.pdf"},
  { id: 2, title: "October 2024", pdfUrl: "/pdfs/october2024.pdf",},
  { id: 3, title: "April 2022", pdfUrl: "/pdfs/april2024.pdf"},
  { id: 4, title: "March 2021", pdfUrl: "/pdfs/march2024.pdf"},
  { id: 5, title: "November 2023", pdfUrl: "/pdfs/november2023.pdf"},
  { id: 6, title: "October 2023", pdfUrl: "/pdfs/october2023.pdf"},
  { id: 7, title: "April 2023", pdfUrl: "/pdfs/april2023.pdf"},
  { id: 8, title: "March 2023", pdfUrl: "/pdfs/march2023.pdf"},
  { id: 9, title: "November 2022", pdfUrl: "/pdfs/november2022.pdf"},
  { id: 10, title: "October 2022", pdfUrl: "/pdfs/october2022.pdf"},
  { id: 11, title: "April 2022", pdfUrl: "/pdfs/april2022.pdf"},
  { id: 12, title: "March 2022", pdfUrl: "/pdfs/march2022.pdf"},
  { id: 13, title: "November 2021", pdfUrl: "/pdfs/november2021.pdf"},
  { id: 14, title: "October 2021", pdfUrl: "/pdfs/october2021.pdf"},
]; // pdf links are fake!

export default function Polls() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Polls</h2>
      
      <div className="space-y-6 max-w-3xl mx-auto">
        {pollData.map((poll, index) => (
          <Link 
            to={`/polls/${poll.id}`} 
            key={poll.id}
            className="block text-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 border border-gray-200"
            style={index % 2 === 0 
              ? { backgroundColor: 'rgb(179, 66, 66)' } 
              : { backgroundColor: 'rgb(50, 72, 143)' }
            }
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{poll.title}</h3>
              <span className="text-gray-200">{poll.date}</span>
            </div>
            <p className="mt-2 text-gray-100">Click to view poll results</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
