import { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { cosmic } from "../cosmic";
import LoadingButton from "./LoadingButton";

export default function ExistingGroupView({ id }) {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [group, setGroup] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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
        setShowSuccessModal(true);
    };

    if (!group) return null;
    return (
        <Container>
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

    const removeOption = (index) => {
        const newResults = poll.results.filter((_, i) => i !== index);
        setPoll({ ...poll, results: newResults });
    };

    return (
        <Container>
            <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                    type="text"
                    value={poll.question}
                    onChange={(e) => setPoll({ ...poll, question: e.target.value })}
                />
            </Form.Group>

            {poll.results.map((entry, index) => (
                <Row key={index} className="mb-2 align-items-center">
                    <Col>
                        <Form.Control
                            type="text"
                            value={entry.option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="number"
                            min="0"
                            value={entry.value}
                            onChange={(e) => handleValueChange(index, e.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button variant="outline-danger" onClick={() => removeOption(index)} size="sm">
                            &times;
                        </Button>
                    </Col>
                </Row>
            ))}

            <Button variant="outline-primary" onClick={addOption}>
                + Add option
            </Button>
        </Container>
    );
}