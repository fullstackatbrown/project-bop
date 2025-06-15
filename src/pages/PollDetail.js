import { useState, useEffect } from 'react';
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
import { queryObjects } from '../cosmic';
import Poll from '../Poll';

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
    const [pollGroup, setPollGroup] = useState(null);
    const [csvUrl, setCsvUrl] = useState(null);

    useEffect(() => {
        (async () => {
            const pollGroupRecv = (await queryObjects({ type: "poll-groups", slug: pollId }))
                .map(raw => { return { ...raw.metadata, title: raw.title } })[0];

            setPollGroup(pollGroupRecv);
            
            const csvBlob = new Blob([pollGroupRecv.csv_data], { type: "text/csv" });
            setCsvUrl(URL.createObjectURL(csvBlob));
        })();

        return () => {
            if (csvUrl) {
                URL.revokeObjectURL(csvUrl);
            }
        };
    }, []);

    if (!pollGroup) return;
    return (
        <div className="container mx-auto py-10 px-4 text-center">
            <h2 className="text-5xl font-bold mb-6 text-red-500">{pollGroup.title} Poll</h2>

            <div className="mb-6 max-w-4xl mx-auto">
                <a
                    href={csvUrl}
                    download={`BOP ${pollGroup.title}.csv`}
                    className="block w-full bg-gray-800 text-white uppercase font-bold py-4 rounded-lg hover:bg-gray-700 transition text-xl text-center"
                >
                    Download Full Results
                </a>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 max-w-6xl mx-auto">
                {JSON.parse(pollGroup.data).map((chartData, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md" style={{ paddingTop: "10px", paddingLeft: "10px", paddingRight: "10px" }}>
                        <Poll data={chartData} tag={`${pollGroup.title} #${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}
