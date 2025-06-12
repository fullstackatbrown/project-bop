import { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { cosmic } from "../cosmic";
import LoadingButton from "./LoadingButton";

export default function ExistingGroupView({ id }) {
    const [title, setTitle] = useState("");
    const [group, setGroup] = useState([]);

    useEffect(() => {
        (async () => {
            const obj = (await cosmic.objects.findOne({ id })).object;
            setTitle(obj.title);
            setGroup(JSON.parse(obj.metadata.data));
        })();
    }, [id]);

    const handleSubmit = async () => {
        await cosmic.objects.updateOne(id, {
            title,
            metadata: {
                data: JSON.stringify(group, null, 4)
            }
        });
    };

    if (!group) return null;
    return (
        <Container>
            <h3>
                Edit Poll Group {title}
                &nbsp;
                <LoadingButton variant="primary" text="Save changes" onClick={handleSubmit} />
            </h3>

            <GroupEditor group={group} setGroup={setGroup} />
        </Container>
    );
}

function GroupEditor({ group, setGroup }) {
    const updatePoll = (index, newPoll) => {
        const updated = [...group];
        updated[index] = newPoll;
        setGroup(updated);
    };

    const addPoll = () => {
        setGroup([
            ...group,
            {
                question: "New Poll",
                results: { "Option 1": 0 },
            }
        ]);
    };

    const removePoll = index => { // doesnt work
        const updated = group.filter((_, i) => i !== index);
        setGroup(updated);
    };

    return (
        <>
            {group.map((poll, i) => (
                <Card key={i} className="mb-4 p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5>Poll {i + 1}</h5>
                        <Button variant="danger" size="sm" onClick={() => removePoll(i)}>
                            Delete
                        </Button>
                    </div>
                    <PollEditor
                        poll={poll}
                        setPoll={newPoll => updatePoll(i, newPoll)}
                    />
                </Card>
            ))}
            <Button onClick={addPoll}>+ Add poll</Button>
        </>
    );
}

function PollEditor({ poll, setPoll }) {
    const handleKeyChange = (key, newKey) => {
        if (newKey === key) return;

        const newResults = { ...poll.results };
        newResults[newKey] = newResults[key];
        delete newResults[key];

        setPoll({ question: poll.question, results: newResults });
    };

    const handleValueChange = (key, newValue) => {
        const newResults = { ...poll.results, [key]: parseInt(newValue) || 0 };
        setPoll({ question: poll.question, results: newResults });
    };

    const addOption = () => {
        const newKey = `Option ${Object.keys(poll.results).length}`;
        const newResults = { ...poll.results, [newKey]: 0 };
        setPoll({ question: poll.question, results: newResults });
    };

    return (
        <Container>
            <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                    type="text"
                    value={poll.question}
                    onChange={e => {
                        setPoll({ question: e.target.value, results: poll.results });
                    }}
                />
            </Form.Group>

            {Object.entries(poll.results).map(([key, value]) => (
                <Row key={key} className="mb-2">
                    <Col>
                        <Form.Control
                            type="text"
                            value={key}
                            onChange={e => handleKeyChange(key, e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="number"
                            min="0"
                            value={value}
                            onChange={e => handleValueChange(key, e.target.value)}
                        />
                    </Col>
                </Row>
            ))}

            <Button variant="outline-primary" onClick={addOption}>
                + Add option
            </Button>
        </Container>
    );
}