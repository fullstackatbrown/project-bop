import React from 'react';
import { useParams } from 'react-router-dom';
import { pollData } from './Polls';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PollDetail() {
    const { pollId } = useParams();

    const poll = pollData.find(p => {
        const key = p.title.toLowerCase().replace(/\s+/g, '-') + "-poll";
        return key === pollId;
    });

    // Sample data for the chart - replace with your actual poll data
    const chartData = {
        labels: ['Yes', 'No', 'Undecided'],
        datasets: [
            {
                data: [60, 30, 10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Poll Results',
                font: {
                    size: 18
                }
            },
        },
    };

    if (!poll) {
        return (
            <div className="container mx-auto py-10 px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Poll not found</h2>
                <a
                    href="/polls"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Back to Polls
                </a>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 text-center">
            {/* Header */}
            <h2 className="text-5xl font-bold mb-6 text-red-500">{poll.title} Poll</h2>

            {/* Download Button */}
            <div className="mb-6 max-w-4xl mx-auto">
                <a
                    href={poll.pdfUrl}
                    download
                    className="block w-full bg-gray-800 text-white uppercase font-bold py-4 rounded-lg hover:bg-gray-700 transition text-xl text-center"
                >
                    Download
                </a>
            </div>

            {/* Poll Results Chart */}
            <div className="mb-10 max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">Poll Results</h3>
                <Pie data={chartData} options={chartOptions} />
            </div>

            {/* PDF */}
            {/* <div className="flex justify-center w-full">
                <div className="w-full max-w-4xl h-screen">
                    <iframe
                        src={poll.pdfUrl}
                        title={`${poll.title} Poll Result PDF`}
                        className="w-full h-full border-0"
                    />
                </div>
            </div> */}
        </div>
    );
}
