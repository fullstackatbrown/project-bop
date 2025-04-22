import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import Papa from "papaparse";
import Poll from "../Poll";
import { postObject } from "../cosmic";
import "./PollUploader.css";

export default function PollUploader() {
    const [pollGroup, setPollGroup] = useImmer([]);
    const [title, setTitle] = useState("");

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css';
        link.rel = 'stylesheet';
        link.id = 'bootstrap-css';
        document.head.appendChild(link);
    
        return () => {
          document.head.removeChild(link);
        };
      }, []);

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === "text/csv") {
            Papa.parse(file, {
                complete: result => {
                    setPollGroup(parseTable(result.data));
                    setError(null);
                    setSuccess(null);
                },
                error: err => {
                    setError("Error parsing CSV file.");
                    console.error(err);
                }
            });
        } else {
            setError("Please upload a valid CSV file.");
        }
    }

    function transpose(twoDArr) {
        const res = [];
        for (let i = 0; i < twoDArr[0].length; i++)
            res.push([]);
        for (let i = 0; i < twoDArr.length; i++) {
            for (let j = 0; j < twoDArr[i].length; j++) {
                res[j].push(twoDArr[i][j]);
            }
        }
        return res;
    }

    function parseTable(table) {
        table = transpose(table);
        return table
            .filter(col => !col[0].startsWith("Timestamp") && !col[0].startsWith("Column"))
            .map(col => {
                const results = {};
                for (let i = 1; i < col.length; i++) {
                    const names = col[i].split(", ");
                    for (const name of names) {
                        if (results[name])
                            results[name]++;
                        else
                            results[name] = 1;
                    }
                }
                for (const [name, count] of Object.entries(results)) {
                    if (isNaN(parseFloat(name)) && count <= 3)
                        delete results[name];
                }
                return {
                    question: col[0],
                    results
                }
            });
    }

    async function uploadPollData() {
        await postObject({
            type: "poll-groups",
            title,
            metadata: {
                data: JSON.stringify(pollGroup, null, 4)
            }
        });
        setPollGroup([]);
        setTitle("");
        setSuccess("Uploaded poll group");
    }

    return (
        <div className="container" id="pu">
            <br />
            <br />
            <div className="row">
                <div className="col-4">
                    <h4>Set Poll Tag</h4>
                    <input type="text" value={title} onChange={event => setTitle(event.target.value)} placeholder="February 2025" />
                </div>
                <div className="col-4">
                    <h4>Upload a CSV File</h4>
                    <input type="file" accept=".csv" onChange={handleFileUpload} />
                    {error ? <p style={{color: "red"}}>{error}</p> : null}
                </div>
                <div className="col-4">
                    <button onClick={uploadPollData}>Upload poll group</button>
                    {success ? <p style={{color: "green"}}>{success}</p> : null}
                </div>
            </div>

            {pollGroup.map((data, dataIndex) => (
                <>
                    <div className="row">
                        <div className="col-6">
                            <Poll data={data} tag={""} />
                        </div>
                        <div className="col-6">
                            {Object.entries(data.results).map(([name, count]) => (
                                <div className="row">
                                    <div className="col-5">
                                        <input type="text" value={name}></input>
                                    </div>
                                    <div className="col-5">
                                        <input type="number" value={count} onChange={event => {
                                            setPollGroup(pollGroup => {
                                                const value = parseFloat(event.target.value);
                                                pollGroup[dataIndex].results[name] = !isNaN(value) ? value : "";
                                                return pollGroup;
                                            })
                                        }}></input>
                                    </div>
                                    <div className="col-2">
                                        <button onClick={() => {
                                            setPollGroup(pollGroup => {
                                                delete pollGroup[dataIndex].results[name];
                                                return pollGroup;
                                            })
                                        }}>&times;</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <br />
                </>
            ))}
        </div>
    );
}