import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { pollData } from './Polls';

export default function PollDetail() {
    const { pollId } = useParams();
    const history = useHistory();

    const poll = pollData.find(p => {
        const key = p.title.toLowerCase().replace(/\s+/g, '-') + "-poll";
        return key === pollId;
    });

    if (!poll) {
        return (
            <div className="container mx-auto py-10 px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Poll not found</h2>
                <button
                    onClick={() => history.push('/polls')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Back to Polls
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-center items-center mb-6">
                <h2 className="text-4xl font-bold">{poll.title}</h2>
            </div>
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