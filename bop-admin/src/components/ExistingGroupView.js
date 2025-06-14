import { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button, Card, Modal } from "react-bootstrap";
import { cosmic } from "../cosmic";
import { useSearchSaveNavigate } from "../searchSaveNavigate";
import LoadingButton from "./LoadingButton";
import PollView from "./PollView";

export default function ExistingGroupView({ id }) {
    const navigate = useSearchSaveNavigate();

    const [title, setTitle] = useState(null);
    const [group, setGroup] = useState(null);
    const [loadModified, setLoadModified] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        (async () => {
            const obj = (await cosmic.objects.findOne({ id })).object;
            setGroup(JSON.parse(obj.metadata.data));
            setLoadModified(obj.modified_at);
            setTitle(obj.title);
        })();
    }, [id]);

    const handleSubmit = async () => {
        const latestModified = (await cosmic.objects.findOne({ id })).object.modified_at;
        // eslint-disable-next-line no-restricted-globals
        if (loadModified != latestModified && !confirm("modified times vary")) {
            return;
        }
        
        const updateRes = await cosmic.objects.updateOne(id, {
            title,
            metadata: {
                data: JSON.stringify(group, null, 4)
            }
        });
        setLoadModified(updateRes.object.modified_at);
        setShowSuccessModal(true);
    };

    if (!title) return null;
    return (
        <Container className="mt-4">
            <h3>
                Edit Poll Group {title}
                &nbsp;
                <LoadingButton variant="primary" text="Save edits" onClick={handleSubmit} />
            </h3>

            <GroupEditor group={group} setGroup={setGroup} />

            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Poll Group Saved</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your edits have been saved.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                        Continue editing
                    </Button>
                    <Button variant="success" onClick={() => navigate("/poll")}>
                        Return to menu
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

function GroupEditor({ group, setGroup }) {
    const updatePoll = (index, newPoll) => {
        const newGroup = [...group];
        newGroup[index] = newPoll;
        setGroup(newGroup);
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

    const removePoll = index => {
        setGroup(group.filter((_, i) => i != index));
    };

    return (
        <>
            {group.map((poll, i) => (
                <Card key={i} className="mb-4 p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5>Poll #{i + 1}</h5>
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
    const moveOption = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= poll.results.length) return;
        const newResults = [...poll.results];
        const [moved] = newResults.splice(fromIndex, 1);
        newResults.splice(toIndex, 0, moved);
        setPoll({ ...poll, results: newResults });
    };

    const handleOptionChange = (index, newOption) => {
        const newResults = [...poll.results];
        newResults[index].option = newOption;
        setPoll({ ...poll, results: newResults });
    };

    const handleValueChange = (index, newValue) => {
        const newResults = [...poll.results];
        newResults[index].value = parseInt(newValue) || 0;
        setPoll({ ...poll, results: newResults });
    };

    const addOption = () => {
        const newResults = [...poll.results, { option: `Option ${poll.results.length + 1}`, value: 0 }];
        setPoll({ ...poll, results: newResults });
    };

    const removeOption = index => {
        const newResults = poll.results.filter((_, i) => i != index);
        setPoll({ ...poll, results: newResults });
    };

    return (
        <Container>
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    value={poll.question}
                    onChange={e => setPoll({ ...poll, question: e.target.value })}
                />
            </Form.Group>

            <Row>
                <Col>
                    <PollView data={poll} />
                </Col>
                <Col>
                    <Form.Group className="mb-3 d-flex align-items-center gap-2">
                        <Form.Label className="mb-0">Chart type</Form.Label>
                        <Form.Select
                            value={poll.chart}
                            onChange={(e) => setPoll({ ...poll, chart: e.target.value })}
                            style={{ width: "120px" }}
                        >
                            <option value="bar">Bar</option>
                            <option value="pie">Pie</option>
                        </Form.Select>
                    </Form.Group>

                    {poll.results.map((entry, index) => (
                        <Row key={index} className="mb-2 align-items-center">
                            <Col>
                                <Form.Control
                                    type="text"
                                    value={entry.option}
                                    onChange={e => handleOptionChange(index, e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    value={entry.value}
                                    onChange={e => handleValueChange(index, e.target.value)}
                                />
                            </Col>
                            <Col xs="auto" className="d-flex gap-1 px-0">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => moveOption(index, index - 1)}
                                    disabled={index == 0}
                                >
                                    &uarr;
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => moveOption(index, index + 1)}
                                    disabled={index == poll.results.length - 1}
                                >
                                    &darr;
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeOption(index)}
                                >
                                    &times;
                                </Button>
                            </Col>

                        </Row>
                    ))}

                    <Button variant="outline-primary" onClick={addOption}>
                        + Add option
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}