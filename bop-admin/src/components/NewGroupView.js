import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import { parse as csvParse } from "papaparse";
import { cosmic } from "../cosmic";
import LoadingButton from "./LoadingButton";

export default function NewGroupView({ setId }) {
    const [title, setTitle] = useState("");
    const [csvFile, setCsvFile] = useState(null);

    const parseTable = text => {
        const transpose = twoDArr => {
            const res = [];
            for (let i = 0; i < twoDArr[0].length; i++)
                res.push([]);
            for (let i = 0; i < twoDArr.length; i++) {
                for (let j = 0; j < twoDArr[i].length; j++) {
                    res[j].push(twoDArr[i][j]);
                }
            }
            return res;
        };

        const objectToArray = obj => {
            return Object.entries(obj)
                .map(([option, value]) => ({ option, value }));
        }
        
        const parseRes = csvParse(text);
        if (parseRes.errors.length != 0) {
            console.error(parseRes.errors);
        }
        return transpose(parseRes.data)
            .filter(col => !col[0].startsWith("Timestamp") && !col[0].startsWith("Column"))
            .map(col => {
                const results = {};
                for (let i = 1; i < col.length; i++) {
                    const names = col[i].split(", ");
                    for (const name of names) {
                        if (results[name]) {
                            results[name]++;
                        } else {
                            results[name] = 1;
                        }
                    }
                }
                for (const [name, count] of Object.entries(results)) {
                    if (isNaN(parseFloat(name)) && count <= 3) {
                        delete results[name];
                    }
                }
                return {
                    question: col[0],
                    results: objectToArray(results),
                    chart: "pie"
                }
            });
    };

    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file && file.type == "text/csv") {
            setCsvFile(file);
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    const readFileText = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
                resolve(e.target.result);
            };
            reader.onerror = e => {
                reject(e.target.error);
            }
            reader.readAsText(file);
        });
    }

    const handleSubmit = async () => {
        let newId;
        try {
            const csvData = await readFileText(csvFile);
            const data = parseTable(csvData);

            newId = (await cosmic.objects.insertOne({
                type: "poll-groups",
                title,
                metadata: {
                    data: JSON.stringify(data, null, 4),
                    csv_data: csvData
                }
            })).object.id;
        } catch (err) {
            console.error("Poll group creation failed:", err);
            alert("Poll group creation failed");
            return;
        }

        setId(newId);
    };

    return (
        <Container className="mt-4">
            <h3>Create New Poll Group</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formGroupTitle">
                    <Form.Label>Group Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter group title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupCSV">
                    <Form.Label>Upload CSV File</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        required
                    />
                </Form.Group>

                <LoadingButton variant="primary" text="Create group" onClick={handleSubmit} />
            </Form>
        </Container>
    );
}