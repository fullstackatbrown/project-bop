import React from 'react';
import { useParams } from 'react-router-dom';
import { pollData } from './Polls';

export default function PollDetail() {
    const { pollId } = useParams();

    const poll = pollData.find(p => {
        const key = p.title.toLowerCase().replace(/\s+/g, '-') + "-poll";
        return key === pollId;
    });

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

            {/* PDF */}
            <div className="flex justify-center w-full">
                <div className="w-full max-w-4xl h-screen">
                    <iframe
                        src={poll.pdfUrl}
                        title={`${poll.title} Poll Result PDF`}
                        className="w-full h-full border-0"
                    />
                </div>
            </div>
        </div>
    );
}
