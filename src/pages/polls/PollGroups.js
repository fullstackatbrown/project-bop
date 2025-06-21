import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cosmic, cosmicFind } from "../../cosmic";
import { publicUrl } from "../../publicUrl";

const pdfTitles = [
    "April 2022",
    "April 2023",
    "April 2024",
    "December 2021",
    "March 2022",
    "March 2023",
    "March 2024",
    "November 2022",
    "November 2023",
    "October 2021",
    "October 2022",
    "October 2023"
];

export default function PollGroups() {
    const [openYears, setOpenYears] = useState({});
    const [groupedByYear, setGroupedByYear] = useState({});

    useEffect(() => {
        (async () => {
            const pollData = (await cosmicFind({ type: "poll-groups" }))
                .map(raw => raw.title)
                .concat(pdfTitles);
            setGroupedByYear(
                pollData.reduce((acc, poll) => {
                    const year = poll.split(" ")[1];
                    if (!acc[year]) acc[year] = [];
                    acc[year].push(poll);
                    return acc;
                }, {})
            );
        })();
    }, []);

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
                    className={`px-4 py-2 rounded transition ${allOpen ? "bg-gray-300" : "bg-gray-800 hover:bg-gray-700 text-white"
                        } ${allOpen ? "pointer-events-none" : ""}`}
                >
                    Expand All
                </button>

                <button
                    onClick={collapseAllYears}
                    className={`px-4 py-2 rounded transition ${allClosed
                        ? "bg-gray-300"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                        } ${allClosed ? "pointer-events-none" : ""}`}
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
                                    className={`w-4 h-4 mr-2 transform transition-transform duration-200 ${openYears[year] ? "rotate-90" : "rotate-0"
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                                {year} Polls
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openYears[year]
                                    ? "max-h-screen opacity-100"
                                    : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="space-y-3 ml-6">
                                    {groupedByYear[year].map((poll, index) => {
                                        const key = poll.toLowerCase().replace(/\s+/g, "-");
                                        if (!pdfTitles.includes(poll)) {
                                            return (
                                                <Link
                                                    to={`/polls/${key}`}
                                                    key={key}
                                                    className="block text-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-4 border border-gray-200"
                                                    style={
                                                        index % 2 === 0
                                                            ? { backgroundColor: "rgb(179, 66, 66)" }
                                                            : { backgroundColor: "rgb(50, 72, 143)" }
                                                    }
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg">{poll}</span>
                                                    </div>
                                                </Link>
                                            );
                                        } else {
                                            return (
                                                <a
                                                    href={publicUrl(`/pdfs/${key}.pdf`)}
                                                    className="block text-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-4 border border-gray-200"
                                                    style={
                                                        index % 2 === 0
                                                            ? { backgroundColor: "rgb(179, 66, 66)" }
                                                            : { backgroundColor: "rgb(50, 72, 143)" }
                                                    }
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg">{poll}</span>
                                                    </div>
                                                </a>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
