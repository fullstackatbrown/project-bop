import { useEffect, useState } from "react";
import {
    ListGroup,
    Button,
    ButtonGroup,
    Container,
    Modal,
    Row,
    Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { cosmic } from "../cosmic";

export default function NewsList() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        (async () => {
            setArticles(
                (await cosmic.objects.find({ type: "news-posts" })).objects
                    .map(raw => (
                        {
                            id: raw.id,
                            slug: raw.slug,
                            title: raw.title,
                            date: raw.metadata.date_published
                        }
                    ))
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            );
        })();
    }, []);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const navigate = useNavigate();

    const handleEdit = id => {
        navigate(`/news/${id}`);
    };

    const confirmDelete = id => {
        setIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmed = () => {
        if (idToDelete !== null) {
            // cosmic delete
            setShowDeleteModal(false);
            setIdToDelete(null);
        }
    };

    return (
        <Container className="mt-4">
            <h3>
                News Articles
                &nbsp;
                <Button variant="success" onClick={() => navigate("/news/new")}>+ New</Button>
            </h3>

            <ListGroup>
                {articles.map((article, index) => (
                    <ListGroup.Item key={index}>
                        <Row className="align-items-center">
                            <Col xs={1} className="text-muted small">{article.date}</Col>
                            <Col xs={8}>{article.title}</Col>
                            <Col xs={3} className="text-end">
                                <ButtonGroup size="sm">
                                    <Button variant="outline-primary" onClick={() => handleEdit(article.id)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => confirmDelete(article.id)}>
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
                    Are you sure you want to delete this article?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmed}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
