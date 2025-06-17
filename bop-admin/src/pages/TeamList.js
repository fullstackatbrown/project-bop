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
import { cosmic } from "../cosmic";
import { useSearchSaveNavigate } from "../searchSaveNavigate";
import LoadingButton from "../components/LoadingButton";

export default function TeamList() {
    const navigate = useSearchSaveNavigate();

    const [members, setMembers] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const reloadMembers = async () => {
        setMembers(
            (await cosmic.objects.find({ type: "team-members" })).objects
                .map(raw => ({
                    id: raw.id,
                    name: raw.metadata.name,
                    clubTitle: raw.metadata.club_title
                }))
        );
    };

    useEffect(() => { reloadMembers() }, []);

    const confirmDelete = id => {
        setIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmed = async () => {
        if (idToDelete != null) {
            try {
                await cosmic.objects.deleteOne(idToDelete);
            } catch (err) {
                console.error("Member deletion failed:", err);
                alert("Member deletion failed");
                return;
            }

            await reloadMembers();
            setShowDeleteModal(false);
            setIdToDelete(null);
        }
    };

    return (
        <Container className="mt-4">
            <h3>
                Team Members
                &nbsp;
                <Button variant="success" onClick={() => navigate("/team/new")}>+ New</Button>
            </h3>

            <ListGroup>
                {members.map((member, index) => (
                    <ListGroup.Item key={index}>
                        <Row className="align-items-center">
                            <Col xs={5}>{member.name}</Col>
                            <Col xs={4}>{member.clubTitle}</Col>
                            <Col xs={3} className="text-end">
                                <ButtonGroup size="sm">
                                    <Button variant="outline-primary" onClick={() => navigate(`/team/${member.id}`)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => confirmDelete(member.id)}>
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
                    Are you sure you want to delete this member?
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