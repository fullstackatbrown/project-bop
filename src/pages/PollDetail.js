import React from 'react';
import { useParams } from 'react-router-dom';
import { pollData } from './Polls';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement
);

export default function PollDetail() {
    const { pollId } = useParams();

    const poll = pollData.find(p => {
        const key = p.title.toLowerCase().replace(/\s+/g, '-') + "-poll";
        return key === pollId;
    });

    const mockData = [
        {
            type: "bar",
            data: {
                labels: ["Red", "Blue", "Green"],
                datasets: [
                    {
                        label: "Votes",
                        data: [10, 20, 30],
                        backgroundColor: ["#F87171", "#60A5FA", "#34D399"],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
            },
        },
        {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        label: "Activity",
                        data: [5, 15, 25],
                        borderColor: "#60A5FA",
                        backgroundColor: "#BFDBFE",
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
            },
        },
        {
            type: "pie",
            data: {
                labels: ["Dogs", "Cats", "Birds"],
                datasets: [
                    {
                        label: "Pets",
                        data: [40, 30, 30],
                        backgroundColor: ["#FCD34D", "#FBBF24", "#F59E0B"],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
            },
        },
        {
            type: "doughnut",
            data: {
                labels: ["Dogs", "Cats", "Birds"],
                datasets: [
                    {
                        label: "Pets",
                        data: [40, 30, 30],
                        backgroundColor: ["#FCD34D", "#FBBF24", "#F59E0B"],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
            },
        },
        // Other poll data...
    ];

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

    // Function to render the appropriate chart based on type
    const renderChart = (chartData, index) => {
        switch (chartData.type) {
            case 'bar':
                return <Bar key={index} data={chartData.data} options={chartData.options} />;
            case 'line':
                return <Line key={index} data={chartData.data} options={chartData.options} />;
            case 'pie':
                return <Pie key={index} data={chartData.data} options={chartData.options} />;
            case 'doughnut':
                return <Doughnut key={index} data={chartData.data} options={chartData.options} />;
            default:
                return null;
        }
    };

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

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 max-w-6xl mx-auto">
                {mockData.map((chartData, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4">
                            {chartData.data.datasets[0].label}
                        </h3>
                        <div className="h-64">
                            {renderChart(chartData, index)}
                        </div>
                    </div>
                ))}
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
