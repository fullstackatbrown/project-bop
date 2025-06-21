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
import { cosmic } from "../../cosmic";
import { useSearchSaveNavigate } from "../../searchSaveNavigate";
import LoadingButton from "../../components/LoadingButton";

export default function NewsList() {
    const navigate = useSearchSaveNavigate();

    const [articles, setArticles] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const reloadArticles = async () => {
        setArticles(
            (await cosmic.objects.find({ type: "news-posts" })).objects
                .map(raw => ({
                    id: raw.id,
                    title: raw.title,
                    date: raw.metadata.date_published
                }))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
    };

    useEffect(() => { reloadArticles() }, []);

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

            await reloadArticles();
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
                                    <Button variant="outline-primary" onClick={() => navigate(`/news/${article.id}`)}>
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
                    <LoadingButton variant="danger" text="Delete" onClick={handleDeleteConfirmed} />
                </Modal.Footer>
            </Modal>
        </Container>
    );
}