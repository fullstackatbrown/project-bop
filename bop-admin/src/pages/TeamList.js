import { useEffect, useState } from "react";
import {
    ListGroup,
    Button,
    ButtonGroup,
    Container,
    Modal,
    Row,
    Col,
    Form
} from "react-bootstrap";
import { cosmic } from "../cosmic";
import { useSearchSaveNavigate } from "../searchSaveNavigate";
import LoadingButton from "../components/LoadingButton";

export default function TeamList() {
    const navigate = useSearchSaveNavigate();

    const [members, setMembers] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const [showMoveModal, setShowMoveModal] = useState(false);
    const [idToMove, setIdToMove] = useState(null);
    const [newIdAbove, setNewIdAbove] = useState("0");
    const memberToMove = members.find(member => member.id == idToMove) || null;

    const reloadMembers = async () => {
        const sortMembers = start => {
            try {
                let end = [start.find(member => member.idAbove == "0")];
                while (end.length < start.length) {
                    end.push(start.find(member => member.idAbove == end[end.length - 1].id));
                }
                return end;
            } catch (err) {
                console.error("sort failed");
                return start;
            }
        };

        setMembers(
            sortMembers(
                (await cosmic.objects.find({ type: "team-members" })).objects
                    .map(raw => ({
                        id: raw.id,
                        name: raw.metadata.name,
                        clubTitle: raw.metadata.club_title,
                        idAbove: raw.metadata.id_above
                    }))
            )
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

    const startMove = id => {
        setIdToMove(id);
        setShowMoveModal(true);
    };

    const handleMove = async () => {
        if (idToMove != null) {
            try {
                await cosmic.objects.updateOne(
                    idToMove,
                    { metadata: { id_above: newIdAbove } }
                );

                const newIdBelow = members.find(member => member.idAbove == newIdAbove)?.id;
                if (newIdBelow) {
                    await cosmic.objects.updateOne(
                        newIdBelow,
                        { metadata: { id_above: idToMove } }
                    );
                }

                const oldIdBelow = members.find(member => member.idAbove == idToMove)?.id;
                if (oldIdBelow) {
                    await cosmic.objects.updateOne(
                        oldIdBelow,
                        { metadata: { id_above: memberToMove.idAbove } }
                    );
                }
            } catch (err) {
                console.error("Member move failed:", err);
                alert("Member move failed");
                return;
            }

            await reloadMembers();
            setShowMoveModal(false);
            setIdToDelete(null);
            setNewIdAbove("0");
        }
    };

    const magic = async () => {
        await cosmic.objects.updateOne(members[0].id, { metadata: { id_above: "0" } });
        console.log(0);
        for (let i = 1; i < members.length; i++) {
            await cosmic.objects.updateOne(members[i].id, { metadata: { id_above: members[i - 1].id } });
            console.log(i);
        }
    };

    return (
        <Container className="mt-4">
            <h3>
                Team Members
                &nbsp;
                <Button variant="success" onClick={() => navigate("/team/new")}>+ New</Button>
            </h3>
            <button onClick={magic}>magic</button>

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
                                    <Button variant="outline-secondary" onClick={() => startMove(member.id)}>
                                        Move
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

            <Modal show={showMoveModal} onHide={() => setShowMoveModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Move Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Choose where to move this member:
                    <Form.Select
                        value={newIdAbove}
                        onChange={e => setNewIdAbove(e.target.value)}
                    >
                        <option value="0">To the top</option>
                        {
                            members
                                .filter(member => member.id != idToMove && member.id != memberToMove?.idAbove)
                                .map(member => <option value={member.id}>Below {member.name}</option>)
                        }
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMoveModal(false)}>
                        Cancel
                    </Button>
                    <LoadingButton variant="success" text="Move" onClick={handleMove} />
                </Modal.Footer>
            </Modal>
        </Container>
    );
}