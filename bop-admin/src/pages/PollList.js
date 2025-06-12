import { useEffect, useState } from "react";
import {
    ListGroup,
    Button,
    ButtonGroup,
    Container,
    Modal,
    Row,
    Col
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { cosmic } from "../cosmic";
import LoadingButton from "../components/LoadingButton";

export default function PollList() {
    const [pollGroups, setPollGroups] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const reloadPollGroups = async () => {
        setPollGroups(
            (await cosmic.objects.find({ type: "poll-groups" })).objects
                .map(raw => ({
                    id: raw.id,
                    title: raw.title
                }))
        );
    };

    useEffect(() => { reloadPollGroups() }, []);

    const navigate = useNavigate();

    const confirmDelete = id => {
        setIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmed = async () => {
        if (idToDelete != null) {
            try {
                await cosmic.objects.deleteOne(idToDelete);
            } catch (err) {
                console.error("Article deletion failed:", err);
                alert("Article deletion failed");
                return;
            }

            await reloadPollGroups();
            setShowDeleteModal(false);
            setIdToDelete(null);
        }
    };

    return (
        <Container className="mt-4">
            <h3>
                Poll Groups
                &nbsp;
                <Button variant="success" onClick={() => navigate("/poll/new")}>+ New</Button>
            </h3>

            <ListGroup>
                {pollGroups.map((pollGroup, index) => (
                    <ListGroup.Item key={index}>
                        <Row className="align-items-center">
                            <Col xs={9}>{pollGroup.title}</Col>
                            <Col xs={3} className="text-end">
                                <ButtonGroup size="sm">
                                    <Button variant="outline-primary" onClick={() => navigate(`/poll/${pollGroup.id}`)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => confirmDelete(pollGroup.id)}>
                                        Delete
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this poll group?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <LoadingButton variant="danger" text="Delete" onClick={handleDeleteConfirmed} />
                </Modal.Footer>
            </Modal>
        </Container>
    );
}